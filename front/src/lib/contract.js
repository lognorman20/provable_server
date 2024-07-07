import dotenv from 'dotenv';
import path from 'path';
import { RpcProvider, Contract, Account, ec, json } from 'starknet';

// Ensure dotenv is configured at the very beginning
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const privateKey0 = process.env.PRIVATE_KEY;

if (!privateKey0) {
  throw new Error("PRIVATE_KEY environment variable is not set");
}

const account0Address = '0x02e6721d8276a16dbfccf2416a2d5fecd40d8adaf6ef528d4aea24f63d3cc03b'; // make sure ur wallet has some eth from the faucet
const contractAddress = '0x04b306b10d8be501edc8ba8de2b318b103398b61b3c6aa6570cc891533088b72';

let account0;
let contract;
let provider = new RpcProvider({ nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7' }); // Define the provider with your RPC URL

export async function initializeContract() {
    try {
        account0 = new Account(provider, account0Address, privateKey0);
        const { abi: testAbi } = await provider.getClassAt(contractAddress);
        if (!testAbi) {
            throw new Error('No ABI found.');
        }
        contract = new Contract(testAbi, contractAddress, provider);
        contract.connect(account0);
    } catch (error) {
        console.error('Error initializing contract:', error);
    }
}

initializeContract();

export async function createFile(path, contentHash) {
    try {
        console.log("createFile called with:", { path, contentHash });

        if (!path || !contentHash) {
            throw new Error('Invalid path or contentHash');
        }
        const myCall = contract.populate('create_file', [path, contentHash]);
        console.log("myCall:", myCall.calldata);
        const res = await contract.create_file(myCall.calldata);
        await provider.waitForTransaction(res.transaction_hash);

        console.log("createFile response:", res);
        return res;
    } catch (error) {
        console.error("Error creating file:", error);
        throw error;
    }
}

export async function updateFile(path, prevContentHash, newContentHash) {
    try {
        const myCall = contract.populate('update', [path, prevContentHash, newContentHash]);
        const res = await contract.update(myCall.calldata);
        await provider.waitForTransaction(res.transaction_hash);
        console.log("updateFile response:", res);
        return res;
    } catch (error) {
        console.error('Error updating file:', error);
    }
}

export async function removeFile(contentHash) {
    try {
        const myCall = contract.populate('remove', [contentHash]);
        const res = await contract.remove(myCall.calldata);
        await provider.waitForTransaction(res.transaction_hash);
        console.log("removeFile response:", res);
        return res;
    } catch (error) {
        console.error('Error removing file:', error);
    }
}

export async function getFileCount() {
    try {
        const res = await contract.get_file_count();
        console.log("getFileCount response:", res);
        return res;
    } catch (error) {
        console.error('Error getting file count:', error);
    }
}

export async function getFile(contentHash) {
    try {
        const res = await contract.get_file(contentHash);
        console.log("getFile response:", res);
        return res;
    } catch (error) {
        console.error('Error getting file:', error);
    }
}
