use snforge_std::{declare, ContractClass, ContractClassTrait};
use starknet::ContractAddress;
use starknet::contract_address_const;
use contracts::{FileTraitDispatcher, FileTraitDispatcherTrait};
use contracts::File::FileData;
use super::utils::{deploy_file_contract};

#[test]
fn test_create() {
    let contract_address = deploy_file_contract();
    let dispatcher = FileTraitDispatcher { contract_address };

    dispatcher.create_file('cheese', 0x123);

    let mut file_count = dispatcher.get_file_count();
    assert_eq!(1, file_count);

    dispatcher.create_file('SPOTEMGOTEM', 0x1234);
    dispatcher.create_file('butter', 0x12345);

    let mut file_count = dispatcher.get_file_count();
    assert_eq!(3, file_count);

    dispatcher.create_file('butter', 0x12345);
    assert_eq!(3, file_count);
}

#[test]
fn test_update() {
    let contract_address = deploy_file_contract();
    let dispatcher = FileTraitDispatcher { contract_address };

    dispatcher.create_file('cheese', 0x123);
    dispatcher.update('butter', 0x123, 0x321);

    let file_data = dispatcher.get_file(0x321);
    let path = file_data.path;

    assert_eq!('butter', path);
}

#[test]
fn test_remove() {
    let contract_address = deploy_file_contract();
    let dispatcher = FileTraitDispatcher { contract_address };

    dispatcher.create_file('cheese', 0x123);
    dispatcher.remove(0x123);

    let file_count = dispatcher.get_file_count();
    assert_eq!(0, file_count);
}

#[test]
fn test_exists() {
    let contract_address = deploy_file_contract();
    let dispatcher = FileTraitDispatcher { contract_address };

    dispatcher.create_file('cheese', 0x123);
    let check = dispatcher.exists(0x123);

    assert!(check);
}

#[test]
fn test_get_file_count() {
    let contract_address = deploy_file_contract();
    let dispatcher = FileTraitDispatcher { contract_address };

    dispatcher.create_file('cheese', 0x123);
    let file_count = dispatcher.get_file_count();

    assert_eq!(1, file_count);
}

#[test]
fn test_get_file() {
    let contract_address = deploy_file_contract();
    let dispatcher = FileTraitDispatcher { contract_address };

    dispatcher.create_file('cheese', 0x123);
    let file = dispatcher.get_file(0x123);
    let expected_file = FileData { path: 'cheese', content_hash: 0x123 };

    assert_eq!(file, expected_file);
}
