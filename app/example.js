import { RpcProvider, Contract, Account, ec, json } from 'starknet';
import dotenv from 'dotenv';

const provider = new RpcProvider({
    nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7',
});

const privateKey0 = "0x03616e56dd516392009cf3fafa246a294da8cd886824c657b586e6b4a5973bf7";
const account0Address = "0x00E0964B9c635B1D12875F52a4CF5c3F72acffcBC18fdc085A819Eb88656D0FD"; // make sure ur wallet has some eth from the faucet
const account0 = new Account(provider, account0Address, privateKey0);

const contractAddress = '0x04b306b10d8be501edc8ba8de2b318b103398b61b3c6aa6570cc891533088b72';

const { abi: testAbi } = await provider.getClassAt(contractAddress);
if (testAbi === undefined) {
  throw new Error('no abi.');
}
const contract = new Contract(testAbi, contractAddress, provider);
contract.connect(account0);

// create function
const myCall = contract.populate('create_file', ['cheese', 0x1]); // ['path', content_hash]
const res = await contract.create_file(myCall.calldata);
await provider.waitForTransaction(res.transaction_hash);

// update function
const myCall = contract.populate('update', ['butter', 0x1, 0x2]); // ['path', prev_content_hash, new_content_hash]
const res = await contract.update(myCall.calldata);
await provider.waitForTransaction(res.transaction_hash);

// remove function
const myCall = contract.populate('remove', [0x2]); // 0x2 represents the file's content hash
const res = await contract.remove(myCall.calldata);
await provider.waitForTransaction(res.transaction_hash);

const count = await contract.get_file_count();
const file = await contract.get_file(0x2);

console.log(count);
console.log(file);
