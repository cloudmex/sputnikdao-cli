import { SmartContract, ntoy, encodeBase64, decodeUTF8, ONE_NEAR, encodeBase58 } from "near-api-lite";
import { readFileSync, appendFileSync } from "fs";
import { inspect } from "util";
import { configSigner,multiConfigSigner, getDaoContract, getNetworkEnding, TARGET_REMOTE_UPGRADE_CONTRACT_ACCOUNT } from "../util/setup";

import * as sha256 from "near-api-lite/lib/utils/sha256.js";
import { option } from "commander";
/*
export async function daoCreate(): Promise<void> {

  const dao_params = {
    "config": {
      "name": "dao", "symbol": "$META-GOV", "decimals": 24, "purpose": "meta-pool governance", "bond": "1000000000000000000000000", "metadata": ""
    },
    "policy": [
      "lucio.testnet",
      "laura-wulff.testnet",
      "asimov.testnet",
      "lucio2.testnet",
      "lucio3.testnet"
    ]
  };

  const dao_params_base_64 = encodeBase64(decodeUTF8(JSON.stringify(dao_params)));

  const sputnik2Factory = new SmartContract("sputnik2.testnet");
  configSigner(sputnik2Factory, "lucio.testnet")

  await sputnik2Factory.call("create",
    {
      name: "test-dao",
      pubkey: "Cvqie7SJ6xmLNA5KoTAYoUAkhD25KaJLG6N9oSmzT9FK",
      args: dao_params_base_64
    }, 150, ntoy(30));

  //near call $CONTRACT_ID create "{\"name\": \"genesis\", \"args\": \"$ARGS\"}"  --accountId $CONTRACT_ID --amount 5 --gas 150000000000000

}
*/

export async function daoCreate(dao_name:string, council:string, options: Record<string, any>): Promise<void> {
  const policy = {"policy": [
    "alan1.testnet"
  ]}
  const dao_params = {
    "config": {
      "name": dao_name,  "purpose": options.purpose, "bond": options.bond, "metadata": ""
    },
    "policy": [
      council
    ]
  };
  console.log(dao_params);
  const dao_params_base_64 = encodeBase64(decodeUTF8(JSON.stringify(dao_params)));
  console.log(options);
  if (options.accountId==null){
    throw Error(`You need to provide a NEAR ID using --accountId`);
  }
  const dao_factory:string = (getNetworkEnding(options.Env)=='near')? 'sputnik-dao.near':"sputnikv2.testnet";
  const sputnik2Factory = new SmartContract(dao_factory);
  multiConfigSigner(sputnik2Factory, options.accountId,options.Env);

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

export async function daoInit(): Promise<void> {

  const dao_params = {
    "config": {
      "name": "dao", "purpose": "meta-pool governance", "bond": "1000000000000000000000000", "metadata": ""
    },
    "policy": [
      "lucio.testnet",
      "laura-wulff.testnet",
      "asimov.testnet",
      "lucio2.testnet",
      "lucio3.testnet"
    ]
  };

  const dao = getDaoContract()

  dao.call("new", dao_params)

}

export async function daoInfo(): Promise<void> {

  const dao = getDaoContract();
  console.log("location: ", dao.contract_account);

  const result = await dao.view("get_policy");

  console.log(inspect(result, false, 5, true));

}

export async function daoGetPolicy(): Promise<void> {

  const dao = getDaoContract();

  const result = await dao.view("get_policy");

  console.log(inspect(result, false, 5, true));

}

export async function daoProposeUpgrade(wasmFile: string, options: Record<string, any>): Promise<void> {

  const wasmInfo = getBlobHash(wasmFile);

  const dao = getDaoContract();

  if (!options.skip) {
    //store the blob
    const resultBase58Hash = await dao.call("store_blob", wasmInfo.bytes, 200, ntoy(wasmInfo.requiredStorageNears));
    //console.log(inspect(resultHash, false, 5, true));
    //save hash result
    appendFileSync("./blobs.json", JSON.stringify({ wasmFile: wasmFile, base58Hash: resultBase58Hash }));
  }

  const addProposalResult = await dao.call("add_proposal", {
    proposal: {
      target: TARGET_REMOTE_UPGRADE_CONTRACT_ACCOUNT,
      description: "upgrade code",
      kind: {
        UpgradeRemote: {
          receiver_id: TARGET_REMOTE_UPGRADE_CONTRACT_ACCOUNT,
          method_name: "upgrade",
          hash: encodeBase58(wasmInfo.hash),
        }
      }
    }
  }, 200, ONE_NEAR.toString());

  console.log(inspect(addProposalResult, false, 5, true));

}

export async function daoListProposals(): Promise<void> {

  const dao = getDaoContract();

  const result = await dao.view("get_proposals", { from_index: 0, limit: 50 });

  console.log(inspect(result, false, 5, true));

}

export async function daoProposeCall(DaoId:string, MethodCall: string, ArgsCall: string, options: Record<string, any>): Promise<void> {
  let env:string='';
  let dao_factory:string='';
  console.log(options.env);
  if (options.env=='mainnet'){
    env='near';
    dao_factory='sputnik-dao';
  }else if (options.env=='testnet'){
    env='testnet';
    dao_factory='sputnikv2';
  }else{
    throw new Error("This is not a valid network");
  }
  let dao_account = DaoId+'.'+dao_factory+'.'+env
  const dao = getDaoContract(dao_account);

  console.log(ArgsCall);
  console.log(MethodCall);
  
  const addProposalCall = await dao.call("add_proposal", {
    proposal: {
      //target: TARGET_REMOTE_UPGRADE_CONTRACT_ACCOUNT,
      description: "propose a calling a method to target contract",
      kind: {
        FunctionCall: {
          receiver_id: options.targetId,
          //method_name: "get_proposals",
          //args: { from_index: 0, limit: 50 },
          actions: [{method_name: MethodCall, args : encodeBase64(decodeUTF8(ArgsCall)), deposit: "0", gas:"200000000000000"}]
        }
      }
    }
  }, 200, ONE_NEAR.toString());

  console.log(inspect(addProposalCall, false, 5, true));

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

export async function daoRemoveProposal(id: string): Promise<void> {
  const dao = getDaoContract();
  const result = await dao.call("act_proposal", { id: Number(id), action: "RemoveProposal" });
  console.log(inspect(result || "success", false, 5, true));
}

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
  //note: all commander args are strings

  const dao = getDaoContract();
  if (options.account) {
    configSigner(dao, options.account);
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
  //note: all commander args are strings

  const dao = getDaoContract();
  if (options.account) {
    configSigner(dao, options.account);
  }

  const proposalId = Number(id);
  if (proposalId.toString() !== id) {
    throw Error(`invalid number: ${id} => ${proposalId}`);
  }

  //near call $SPUTNIK_ID act_proposal '{"id": 0, "action": "VoteApprove"}' --accountId testmewell.testnet
  const result = await dao.call("act_proposal", { id: proposalId, action: "VoteRemove" });

  console.log(inspect(result || "success", false, 5, true));

}

