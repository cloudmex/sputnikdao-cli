import { broadcast_tx_commit_actions, deleteKey, PublicKey } from "near-api-lite";
import { getCredentials } from "../util/setup";

export async function deleteFCAK(): Promise<void> {
  const keys =
    [
      {
        public_key: "ed25519:YAHjA3JMpgJQeMpT6Qgttmc3A3vMjVDP3mmZaeuCB8V",
        access_key: {
          nonce: 0,
          permission: {
            FunctionCall: {
              allowance: "250000000000000000000000",
              receiver_id: "dev-1602564356279-3567853",
              method_names: []
            }
          }
        }
      }
    ];

  const cred = getCredentials("lucio.testnet");

  for (const key of keys) {
    /*if (key.access_key.permission != "FullAccess") {
      console.log(key.access_key.nonce, JSON.stringify(key.access_key.permission));
      const actions = [deleteKey(PublicKey.fromString(key.public_key))];
      await broadcast_tx_commit_actions(actions, "lucio.testnet", "lucio.testnet", cred.private_key);
    }*/
  }

}
