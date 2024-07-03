#[derive(PartialEq, Drop, Copy, Hash)]
pub struct File {
    pub path: felt252,
    pub is_dir: bool,
    pub content_hash: felt252
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
