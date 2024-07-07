import {Mainv0} from "../components/mainv0";
import { Account, RpcProvider, json, Contract, hash} from 'starknet';
import fs from 'fs';
import * as dotenv from 'dotenv';
import { initializeContract } from '../lib/contract';

export default function Home() {
  return (
  <main className="mainV0">
    <Mainv0 />
  </main>
  );
}
