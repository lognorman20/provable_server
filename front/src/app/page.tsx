import {Mainv0} from "../components/mainv0";
import { Account, RpcProvider, json, Contract, hash} from 'starknet';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

const provider = new RpcProvider({ nodeUrl: 'https://free-rpc.nethermind.io/sepolia-juno' });
const accountAddress = '0x02e6721d8276a16dbfccf2416a2d5fecd40d8adaf6ef528d4aea24f63d3cc03b';
const privateKey = process.env.PRIVATE_KEY;
const account = new Account(provider, accountAddress, privateKey, "1");

const testHash = hash.starknetKeccak('lzieflzeifnzeoifnzeoifneofi').toString();


export default function Home() {
  return (
  <main className="mainV0">
    <Mainv0 />
    {testHash}
  </main>
  );
}
