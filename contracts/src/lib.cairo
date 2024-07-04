use starknet::ContractAddress;
use core::array::Array;

#[starknet::interface]
trait FileTrait<T> {
    /// @dev Create a new file
    fn create_file(ref self: T, filename: felt252, num_chars: u32, num_lines: u32, content_hash: felt252);
    /// @dev Remove a file from the file system
    fn remove_file(ref self: T, content_hash: felt252);
    /// @dev Update a file's metadata
    fn update(
        ref self: T,
        prev_content_hash: felt252,
        new_content_hash: felt252,
        filename: felt252,
        num_chars: u32,
        num_lines: u32
    );
    /// @dev Function that checks if a given file exists
    fn exists(self: @T, content_hash: felt252) -> bool;
}

#[starknet::contract]
mod File {
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    /// @dev Store the # of files and all files w/ their respective data
    #[storage]
    struct Storage {
        num_files: u8,
        files: LegacyMap::<felt252, FileData>
    }

    #[derive(Copy, Drop, Hash, starknet::Store, starknet::Event, Serde)]
    struct FileData {
        filename: felt252, // use byte array instead?
        num_chars: u32,
        num_lines: u32,
        content_hash: felt252
    }


    #[derive(Drop, starknet::Event)]
    struct Create {
        file: FileData
    }

    /// @dev Represents a vote that was cast
    #[derive(Drop, starknet::Event)]
    struct Update {
        file: FileData
    }

    #[derive(Drop, starknet::Event)]
    struct Remove {
        file: FileData
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        // Initialize the file count to 0
        self.num_files.write(0_u8);
    }

    /// @dev Emit event whenever a CRUD operation takes place
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        // TODO: Ask how to enumerate the different types (create, update, remove)
        Create: Create,
        Update: Update,
        Remove: Remove,
    }

    #[abi(embed_v0)]
    impl FileImpl of super::FileTrait<ContractState> {
        fn create_file(ref self: ContractState, filename: felt252, num_chars: u32, num_lines: u32, content_hash: felt252) {
            let file = FileData { filename, num_chars, num_lines, content_hash };
            self.files.write(content_hash, file);
            self.emit(Create { file, });
        }

        /// @dev Remove a file from the file system
        fn remove_file(ref self: ContractState, content_hash: felt252) {
            if self.exists(content_hash) {
                
            }
        }

        /// @dev Update a given file
        fn update(
            ref self: ContractState,
            prev_content_hash: felt252,
            new_content_hash: felt252,
            filename: felt252,
            num_chars: u32,
            num_lines: u32
        ) {
            self.remove_file(prev_content_hash);
            let file = FileData { filename, num_chars, num_lines, content_hash: new_content_hash };
            self.files.write(new_content_hash, file);
            self.emit(Update { file, });
        }

        /// @dev Check if a file exists
        fn exists(
            self: @ContractState,
            content_hash: felt252
        ) -> bool {
            // how to check if this is null?
            let _ = self.files.read(content_hash);
            false
        }
    }
}