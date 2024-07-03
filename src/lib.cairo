use core::traits::Into;
pub mod merkle_tree;
pub mod file;

use file::File;

fn main() -> File {
    let file = File {
        path: 'cheese/butter.txt',
        is_dir: false,
        content_hash: 0x48656C6C6F20776F726C64
    };
    
    file
}

// #[cfg(test)]
// mod tests {
//     use super::fib;

//     #[test]
//     fn it_works() {
//         assert(fib(16) == 987, 'it works!');
//     }
// }
