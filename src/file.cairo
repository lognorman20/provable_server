use core::poseidon::PoseidonTrait;
use core::hash::{HashStateTrait, HashStateExTrait};

#[derive(PartialEq, Drop, Clone, Hash)]
pub struct File {
    pub path: felt252,
    pub is_dir: bool,
    pub content_hash: felt252
}

pub fn hash_file(file: File) -> felt252 {
    PoseidonTrait::new().update_with(file).finalize()
}

#[generate_trait]
impl FileImpl of FileTrait {
    fn get_path(self: @File) -> felt252 {
        *self.path
    }

    fn is_dir(self: @File) -> bool {
        *self.is_dir
    }

    fn get_content_hash(self: @File) -> felt252 {
        *self.content_hash
    }
}

// impl EqImpl for core::Traits::PartialEq {

// }
