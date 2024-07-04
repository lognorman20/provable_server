use snforge_std::{declare, ContractClass, ContractClassTrait};
use starknet::ContractAddress;
use starknet::contract_address_const;

use contracts::FileTraitDispatcher;

fn deploy_file_contract() ->  ContractAddress {
    let contract = declare("File").unwrap();

    let mut constructor_calldata: Array<felt252> = array![];

    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();

    contract_address
}