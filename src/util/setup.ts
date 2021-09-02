import * as path from "path";
import * as fs from "fs";
import * as os from "os";

import * as network from "near-api-lite/lib/network.js";
import { program } from "commander";
import { SmartContract } from "near-api-lite";

export const hostname = os.hostname();
export const prodMode = false;
export const NETWORK_ID:string = prodMode ? "mainnet" : "testnet";
network.setCurrent(NETWORK_ID);
export const METAPOOL_CONTRACT_ACCOUNT = prodMode ? "contract3.preprod-pool.near" : "contract3.preprod-pool.testnet";
export const OPERATOR_ACCOUNT = prodMode ? "alantests.near" : "operator.preprod-pool." + NETWORK_ID;
export const OWNER_ACCOUNT = "alan1." + NETWORK_ID;

export const TARGET_REMOTE_UPGRADE_CONTRACT_ACCOUNT = "contract3.preprod-pool.testnet";

//--------------
// GLOBAL VARS
//--------------
export const StarDateTime = new Date();
export const TotalCalls = {
  beats: 0,
  stake: 0,
  unstake: 0,
  ping: 0,
  distribute_rewards: 0,
  retrieve: 0
};

export class PersistentData {
  public beatCount = 0;
}
export const globalPersistentData = new PersistentData();

export const debugMode = process.argv.includes("test");

export type Credentials = { account_id: string, private_key: string };

//--------------------------
export function getCredentials(accountId: string): Credentials {
  const homedir = os.homedir();
  const CREDENTIALS_FILE = path.join(homedir, ".near-credentials/default/" + accountId + ".json");
  const credentialsString = fs.readFileSync(CREDENTIALS_FILE).toString();
  const result: Credentials = JSON.parse(credentialsString);
  if (!result.private_key) {
    console.error("INVALID CREDENTIALS FILE. no priv.key");
  }
  return result;
}
//--------------------------
export function newGetCredentials(accountId: string,network: string): Credentials {
  const homedir = os.homedir();
  const CREDENTIALS_FILE = path.join(homedir, ".near-credentials/"+network+"/" + accountId + ".json");
  const credentialsString = fs.readFileSync(CREDENTIALS_FILE).toString();
  const result: Credentials = JSON.parse(credentialsString);
  if (!result.private_key) {
    console.error("INVALID CREDENTIALS FILE. no priv.key");
  }
  return result;
}

//------------------------------------
export function configSigner(contract: SmartContract, signerAccountId: string): void {
  //config contract proxy credentials
  const credentials = getCredentials(signerAccountId);
  contract.signer = signerAccountId;
  contract.signer_private_key = credentials.private_key;
}
//------------------------------------
export function multiConfigSigner(contract: SmartContract, signerAccountId: string, network: string): void {
  //config contract proxy credentials
  const credentials = newGetCredentials(signerAccountId,network);
  contract.signer = signerAccountId;
  contract.signer_private_key = credentials.private_key;
}
//------------------------------------
export function getDaoContract(DaoId: string="fakedao", SignerId: string="alanfake.testnet"): SmartContract {
  //const dao = new SmartContract("metapool.sputnik2.testnet");
  let dao_acc:string=DaoId+".sputnikv2.testnet";

  const dao = new SmartContract(dao_acc);
  configSigner(dao, SignerId);
  return dao;
}

//Return 'near' if mainnet or testnet if 'testnet
export function getNetworkEnding(network:string):string{
  if(network=='mainnet'){
    return 'near';
  }else if(network=='testnet'){
    return 'testnet';
  }else{
    throw new Error("Network not available");
  }
}


//utility
export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

