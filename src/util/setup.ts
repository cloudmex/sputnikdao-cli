import * as path from "path";
import * as fs from "fs";
import * as os from "os";

import { program } from "commander";
import { ONE_NEAR, SmartContract } from "near-api-lite";
const BN = require('bn.js');

export const hostname = os.hostname();
export const prodMode = false;
export const NETWORK_ID:string = prodMode ? "mainnet" : "testnet";
export const SPUTNIK_FACTORY_TESTNET="sputnikv2.testnet"
export const SPUTNIK_FACTORY_MAINNET="sputnik-dao.near"
export const TOKEN_FACTORY_MAINNET="undefined_cli.near"
export const TOKEN_FACTORY_TESTNET="tokenfactory.testnet"
//export const SPUTNIK_WASM_PATH:string = "res/sputnikdao2_bugged.wasm";
export const SPUTNIK_WASM_PATH:string = "res/sputnikdao2-2021-09-28.wasm";
export const METAPOOL_CONTRACT_ACCOUNT = prodMode ? "contract3.preprod-pool.near" : "contract3.preprod-pool.testnet";
export const OPERATOR_ACCOUNT = prodMode ? "alantests.near" : "operator.preprod-pool." + NETWORK_ID;
export const OWNER_ACCOUNT = "alan1." + NETWORK_ID;
//For min bond
export const ONE_TENTH_OF_NEAR = ONE_NEAR;
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
  const CREDENTIALS_FILE = path.join(homedir, ".near-credentials/testnet/" + accountId + ".json");
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
  //console.log(network);
  const CREDENTIALS_FILE = path.join(homedir, ".near-credentials/"+network+"/" + accountId + ".json");
  const credentialsString = fs.readFileSync(CREDENTIALS_FILE).toString();
  const result: Credentials = JSON.parse(credentialsString);
  if (!result.private_key) {
    console.error("INVALID CREDENTIALS FILE. no priv.key");
  }
  return result;
}

//------------------------------------
export function getFactorySC(factory: string=SPUTNIK_FACTORY_TESTNET, network:string="testnet"): string {
  //const dao = new SmartContract("metapool.sputnik2.testnet");
  let factorySC: string;
  if(factory != null){
    factorySC = (network=="mainnet") ? SPUTNIK_FACTORY_MAINNET: factory;
  }else{
    factorySC= (network=="mainnet") ? SPUTNIK_FACTORY_MAINNET: SPUTNIK_FACTORY_TESTNET;
  }
  return factorySC;
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
export function getDaoContract(DaoId: string="fakedao", SignerId: string="alanfake.testnet", factory: string =SPUTNIK_FACTORY_TESTNET, network:string="testnet"): SmartContract {
  //const dao = new SmartContract("metapool.sputnik2.testnet");
  let dao_acc:string
  if(factory != null){
    dao_acc = (network=="mainnet") ? DaoId+"."+SPUTNIK_FACTORY_MAINNET: DaoId+"."+factory;
  }else{
    dao_acc = (network=="mainnet") ? DaoId+"."+SPUTNIK_FACTORY_MAINNET: DaoId+"."+SPUTNIK_FACTORY_TESTNET;
  }
  const dao = new SmartContract(dao_acc);
  configSigner(dao, SignerId);
  return dao;
}

export function getFactoryContract(FactoryContract: string="generic.testnet", SignerId: string="alanfake.testnet"): SmartContract {
  //const dao = new SmartContract("metapool.sputnik2.testnet");

  const SC = new SmartContract(FactoryContract);
  configSigner(SC, SignerId);
  return SC;
}
export function getStakingContract(stakingContract: string, SignerId: string="alanfake.testnet"): SmartContract {
  //const dao = new SmartContract("metapool.sputnik2.testnet");
  const stakingcontract = stakingContract+".generic.testnet"
  const SC = new SmartContract(stakingcontract);
  configSigner(SC, SignerId);
  return SC;
}
export function getSmartContract(contract: string=SPUTNIK_FACTORY_TESTNET, SignerId: string="alanfake.testnet"): SmartContract {
  //const dao = new SmartContract("metapool.sputnik2.testnet");
  const SC = new SmartContract(contract);
  configSigner(SC, SignerId);
  return SC;
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
export function getRandomInt(min:number, max:number) : number{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; 
}

//utility
export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

