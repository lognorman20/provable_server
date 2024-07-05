import { hash, uint256 } from "https://esm.run/starknet@5.14";
import type {
    Block,
    FieldElement,
    Filter,
} from "https://esm.sh/@apibara/indexer/starknet";

const CREATE = "0x02a47a991149c06616a01f06f118096349136f9e54801db12679ae4c408ffcd2";
const UPDATE = "0x01addf9105829d16ee5f7120b14313f9aba97d8a96a20a3b53d8466826522761";
const REMOVE = "0x037a4b2b8902d1d05cacbb8a2b80edd880a19f5668249e345a175b46cedd68da";

enum EventType {
    Create = CREATE,
    Update = UPDATE,
    Remove = REMOVE
}

export const config = {
    streamUrl: "https://sepolia.starknet.a5a.ch",
    startingBlock: 78_560,
    network: "starknet",
    filter: {
        header: { weak: true },
        events: [
            {
                fromAddress: "0x04b306b10d8be501edc8ba8de2b318b103398b61b3c6aa6570cc891533088b72",
                includeReceipt: false,
            }
        ],
    },
    sinkType: "console",
    sinkOptions: {},
};

export default function transform({ events }) {
    return events.map(({ event, transaction }) => {
        let event_type = event.keys[0];
        console.log(event_type);
        return {
            event_data: event.data,
            event_addr: event.fromAddress,
            event_type: EventType[event_type],
            tx_hash: transaction.meta.hash
        };
    });
}
