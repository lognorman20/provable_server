use provable_server::file::FileTrait;
use core::poseidon::PoseidonTrait;
use core::hash::{HashStateTrait, HashStateExTrait};

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
    fn remove(ref self: MerkleFileTree, bad_file: File) -> () {
        if (@self.files).contains(@bad_file) {
            let len_files = self.files.len();
            let pos = self.files.position(@bad_file).unwrap();
            
            let mut output = array![];
            let mut i = 0;
            while i != len_files {
                if i != pos {
                    let curr_file = self.files[i];
                    let tmp_arr = array![*curr_file];
                    output = output.concat(@tmp_arr);
                }
            };

            self.files = output;
        }
    }

    fn calculate_root(ref self: MerkleFileTree) -> felt252 {
        self.files = self.files.unique();
        let mut i = 0;
        let len_files = self.files.len();

        let mut concat = 0;
        while i != len_files {
            let file = *self.files[i];
            let file_hash: felt252 = file.get_content_hash();

            concat += file_hash;
            i += 1;
        };

        let output = PoseidonTrait::new().update_with(concat).finalize();
        output
    }

    // fn get_file(self: @MerkleFileTree, file: felt252) -> File {
    //     let mut i = 0;
    //     let len_files = self.files.len();

    //     while i != len_files {
            
    //     }
    // }

    // fn verify(self: @MerkleFileTree) -> bool {

    // }
}