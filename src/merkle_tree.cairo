use super::File;
use alexandria_data_structures::array_ext::ArrayTraitExt;

struct MerkleFileTree {
    root: felt252,
    files: Array<File>
}

#[generate_trait]
impl MekleFileTreeImpl of MerkleFileTreeTrait {
    fn new() -> MerkleFileTree {
        let mut tree = MerkleFileTree {
            root: 0,
            files: array![]
        };

        tree
    }

    fn get_root(self: @MerkleFileTree) -> felt252 {
        *self.root
    }

    // Insert a new file into the tree
    fn insert(ref self: MerkleFileTree, new_file: File) -> () {
        if !(@self.files).contains(@new_file) {
            let tmp_arr = array![new_file];
            let new_files = (@self.files).concat(@tmp_arr);

            self.files = new_files;
        }
    }

    // Remove a file from the tree
    fn remove(self: @MerkleFileTree, new_file: File) -> () {
        
    }

    fn calculate_root(self: @MerkleFileTree) -> felt252 {
        self.files = @(self.files).unique();
        let mut i = 0;
        let len_files = self.files.len();

        while i != len_files {
            println!("SPOTEMGOTEM");
            i += 1;
        };

        5
    }

    fn get_file(self: @MerkleFileTree, file: felt252) -> File {
        let mut i = 0;
        let len_files = self.files.len();

        while i != len_files {
            
        }
    }

    // fn verify(self: @MerkleFileTree) -> bool {

    // }
}