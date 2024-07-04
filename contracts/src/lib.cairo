use starknet::ContractAddress;
use core::array::Array;

#[starknet::interface]
trait FileTrait<T> {
    /// @dev Create a new file
    fn create_file(ref self: T, path: felt252, content_hash: felt252);
    /// @dev Remove a file from the file system
    fn remove(ref self: T, content_hash: felt252);
    /// @dev Update a file's metadata
    fn update(
        ref self: T,
        path: felt252,
        prev_content_hash: felt252,
        new_content_hash: felt252,
    );
    /// @dev Function that checks if a given file exists
    fn exists(self: @T, content_hash: felt252) -> bool;
    /// @dev Get the # of files within the system
    fn get_file_count(self: @T) -> u8;
    /// @dev Get file data of a particular file
    fn get_file(self: @T, content_hash: felt252) -> contracts::File::FileData;
}

#[starknet::contract]
mod File {
    use contracts::FileTrait;
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    /// @dev Store the # of files and all files w/ their respective data
    #[storage]
    struct Storage {
        num_files: u8,
        files: LegacyMap::<felt252, FileData>
    }

    #[derive(Copy, Drop, Hash, starknet::Store, starknet::Event, Serde, PartialEq, Debug)]
    struct FileData {
        path: felt252, // use byte array instead?
        content_hash: felt252
    }

    #[derive(Drop, starknet::Event)]
    struct Create {
        file: FileData
    }

    #[derive(Drop, starknet::Event)]
    struct Update {
        file: FileData
    }

    #[derive(Drop, starknet::Event)]
    struct Remove {
        content_hash: felt252
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.num_files.write(0_u8);
    }

    /// @dev Emit event whenever a CRUD operation takes place
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Create: Create,
        Update: Update,
        Remove: Remove,
    }

    #[abi(embed_v0)]
    impl FileImpl of super::FileTrait<ContractState> {
        fn create_file(ref self: ContractState, path: felt252, content_hash: felt252) {
            if self.exists(content_hash) {
                return;
            }

            let file = FileData { path, content_hash };
            self.files.write(content_hash, file);

            let prev_file_cnt = self.num_files.read();
            self.num_files.write(prev_file_cnt + 1);

            self.emit(Create { file });
        }

        fn remove(ref self: ContractState, content_hash: felt252) {
            if self.exists(content_hash) {
                let dummy = FileData { path: '', content_hash: 0 };
                self.files.write(content_hash, dummy);
                
                let prev_file_cnt = self.num_files.read();
                self.num_files.write(prev_file_cnt - 1);

                self.emit(Remove { content_hash })
            }
        }

        fn update(
            ref self: ContractState,
            path: felt252,
            prev_content_hash: felt252,
            new_content_hash: felt252,
        ) {
            let dummy = FileData { path: '', content_hash: 0 };
            self.files.write(prev_content_hash, dummy);

            let updated_file = FileData { path, content_hash: new_content_hash };
            self.files.write(new_content_hash, updated_file);

            self.emit(Update { file: updated_file });
        }

        fn exists(
            self: @ContractState,
            content_hash: felt252
        ) -> bool {
            // TODO: ask if there's a better way to check if null
            let dummy = FileData { path: '', content_hash: 0 };
            let file = self.files.read(content_hash);
            
            file != dummy
        }

        fn get_file_count(self: @ContractState) -> u8 {
            self.num_files.read()
        }

        fn get_file(self: @ContractState, content_hash: felt252) -> FileData {
            self.files.read(content_hash)
        }
    }
}
