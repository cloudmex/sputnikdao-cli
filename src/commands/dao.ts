import { SmartContract, ntoy, encodeBase64, decodeUTF8, ONE_NEAR, encodeBase58, yton } from "near-api-lite";
import { readFileSync, appendFileSync } from "fs";
import { inspect } from "util";
import { configSigner, getFactorySC, multiConfigSigner, getDaoContract,getSmartContract, TARGET_REMOTE_UPGRADE_CONTRACT_ACCOUNT, SPUTNIK_WASM_PATH, SPUTNIK_FACTORY_MAINNET, SPUTNIK_FACTORY_TESTNET, TOKEN_FACTORY_MAINNET, TOKEN_FACTORY_TESTNET } from "../util/setup";
import * as fs from 'fs';
import * as sha256 from "near-api-lite/lib/utils/sha256.js";
import * as network from "near-api-lite/lib/network.js";

export async function daoCreate(dao_name: string, council: string, options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);
  const policy = {
    "policy": [
      "alan1.testnet"
    ]
  }
  const dao_params = {
    "config": {
      "name": dao_name, "purpose": options.purpose, "bond": options.bond, "metadata": ""
    },
    "policy": [
      council
    ]
  };
  console.log(dao_params);
  const dao_params_base_64 = encodeBase64(decodeUTF8(JSON.stringify(dao_params)));
  //console.log(options);
  if (options.accountId == null) {
    throw Error(`You need to provide a NEAR ID using --accountId`);
  }
  // let dao_factory: string;
  // if(options.factory != null){
  //   dao_factory = (options.network=="mainnet") ? SPUTNIK_FACTORY_MAINNET: options.factory;
  // }else{
  //   dao_factory= (options.network=="mainnet") ? SPUTNIK_FACTORY_MAINNET: SPUTNIK_FACTORY_TESTNET;
  // }
  const factorySC = getFactorySC(options.factory,options.network);
  const sputnik2Factory = new SmartContract(factorySC);
  multiConfigSigner(sputnik2Factory, options.accountId, options.network);
  console.log(inspect(sputnik2Factory, false, 5, true));
  await sputnik2Factory.call("create",
    {
      name: dao_name,
      args: dao_params_base_64
    }, 150, ntoy(5));

  //near call $CONTRACT_ID create "{\"name\": \"genesis\", \"args\": \"$ARGS\"}"  --accountId $CONTRACT_ID --amount 5 --gas 150000000000000

}
export async function daoDeployCode(): Promise<void> {

  const dao = getDaoContract()
  configSigner(dao, dao.contract_account);

  const code = readFileSync("/home/lucio/repos/metapool/sputnik-dao-contract/sputnikdao2/target/wasm32-unknown-unknown/release/sputnikdao2.wasm")

  return dao.deployCode(code)

}

export async function daoInfo(options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);
  const dao = getDaoContract(options.daoAcc, options.accountId,options.network);
  console.log("location: ", dao.contract_account);

  const result = await dao.view("get_policy");

  console.log(inspect(result, false, 5, true));

}

export async function daoUI(options: Record<string, any>): Promise<void> {
  require("openurl").open("https://testnet-v2.sputnik.fund/")
  //window.open("https://testnet-v2.sputnik.fund/", "_blank");

}

export async function daoGetPolicy(options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);
  const dao = getDaoContract(options.daoAcc, options.accountId,options.network);

  const result = await dao.view("get_policy");

  console.log(inspect(result, false, 5, true));

}

export async function daoListProposals(options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);
  const dao = getDaoContract(options.daoAcc, options.accountId,options.network);

  const result = await dao.view("get_proposals", { from_index: 0, limit: 50 });

  console.log(inspect(result, false, 5, true));

}

type BlobHashResult = { bytes: Uint8Array; hash: Uint8Array; requiredStorageNears: number }

function getBlobHash(wasmFile: string): BlobHashResult {

  const bytes = readFileSync(wasmFile);
  const requiredStorageNears = bytes.length / (100 * 1000) + 0.5; // 1N per 100Kb, add half near to be sure
  //console.log(bufferToHex(sha256.hash(bytes)));

  return {
    bytes: bytes,
    hash: sha256.hash(bytes),
    requiredStorageNears: requiredStorageNears
  }

}

function showBlobHash(wasmFile: string): BlobHashResult {

  const blob = getBlobHash(wasmFile);

  console.log(`size: ${blob.bytes.length} bytes`);

  console.log(`requiredStorageNears: ${blob.requiredStorageNears} N`);

  console.log(`sha256 hash: ${blob.hash}`);

  return blob;
}

export async function daoListHash(wasmFile: string): Promise<void> {

  const _blob = showBlobHash(wasmFile);

}

/*
export async function daoRemoveProposal(id: string): Promise<void> {
  const dao = getDaoContract();
  const result = await dao.call("act_proposal", { id: Number(id), action: "RemoveProposal" });
  console.log(inspect(result || "success", false, 5, true));
}*/

export async function daoRemoveBlob(hashOrWasmFile: string): Promise<void> {

  let hashString: string;
  if (hashOrWasmFile.endsWith(".wasm")) {
    const blob = showBlobHash(hashOrWasmFile)
    hashString = encodeBase58(blob.hash)
  }
  else {
    hashString = hashOrWasmFile
  }

  const dao = getDaoContract();
  const result = await dao.call("remove_blob", { hash: hashString });

  console.log(inspect(result, false, 5, true));
}

export async function daoUpgrade(): Promise<void> {

  const dao = getDaoContract();

  const result = await dao.view("get_policy");

  console.log(inspect(result, false, 5, true));

}

export async function daoVoteApprove(id: string, options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);
  //note: all commander args are strings

  const dao = getDaoContract(options.daoAcc,options.accountId,options.factory,options.network);
  if (options.accountId) {
    configSigner(dao, options.accountId);
  }

  const proposalId = Number(id);
  if (proposalId.toString() !== id) {
    throw Error(`invalid number: ${id} => ${proposalId}`);
  }

  //near call $SPUTNIK_ID act_proposal '{"id": 0, "action": "VoteApprove"}' --accountId testmewell.testnet
  const result = await dao.call("act_proposal", { id: proposalId, action: "VoteApprove" });

  console.log(inspect(result || "success", false, 5, true));

}

//TEMP DEBUG to re-enable as InProgress a proposal approve but failed in execution
export async function daoVoteUnapprove(id: string, options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);
  //note: all commander args are strings

  const dao = getDaoContract(options.daoAcc,options.accountId,options.factory,options.network);
  if (options.accountId) {
    configSigner(dao, options.accountId);
  }

  const proposalId = Number(id);
  if (proposalId.toString() !== id) {
    throw Error(`invalid number: ${id} => ${proposalId}`);
  }

  //near call $SPUTNIK_ID act_proposal '{"id": 0, "action": "VoteApprove"}' --accountId testmewell.testnet
  const result = await dao.call("act_proposal", { id: proposalId, action: "VoteReject" });

  console.log(inspect(result || "success", false, 5, true));

}

export async function daoVoteRemove(id: string, options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);
  //note: all commander args are strings

  const dao = getDaoContract(options.daoAcc,options.accountId,options.factory,options.network);
  if (options.accountId) {
    configSigner(dao, options.accountId);
  }

  const proposalId = Number(id);
  if (proposalId.toString() !== id) {
    throw Error(`invalid number: ${id} => ${proposalId}`);
  }

  //near call $SPUTNIK_ID act_proposal '{"id": 0, "action": "VoteApprove"}' --accountId testmewell.testnet
  const result = await dao.call("act_proposal", { id: proposalId, action: "VoteRemove" });

  console.log(inspect(result || "success", false, 5, true));

}

