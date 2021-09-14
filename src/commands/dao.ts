import { SmartContract, ntoy, yton, encodeBase64, decodeUTF8, ONE_NEAR, encodeBase58 } from "near-api-lite";
import { readFileSync, appendFileSync } from "fs";
import { inspect } from "util";
import { configSigner, multiConfigSigner, getDaoContract, getNetworkEnding, TARGET_REMOTE_UPGRADE_CONTRACT_ACCOUNT } from "../util/setup";
import * as fs from 'fs';
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

export async function daoCreate(dao_name: string, council: string, options: Record<string, any>): Promise<void> {
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
  console.log(options);
  if (options.accountId == null) {
    throw Error(`You need to provide a NEAR ID using --accountId`);
  }
  const dao_factory: string = (getNetworkEnding(options.Env) == 'near') ? 'sputnik-dao.near' : "sputnikv2.testnet";
  const sputnik2Factory = new SmartContract(dao_factory);
  multiConfigSigner(sputnik2Factory, options.accountId, options.Env);

  await sputnik2Factory.call("create",
    {
      name: dao_name,
      args: dao_params_base_64
    }, 150, ntoy(10));

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

export async function daoInfo(options: Record<string, any>): Promise<void> {

  const dao = getDaoContract(options.daoAcc, options.accountId);
  console.log("location: ", dao.contract_account);

  const result = await dao.view("get_policy");

  console.log(inspect(result, false, 5, true));

}

export async function daoGetPolicy(options: Record<string, any>): Promise<void> {

  const dao = getDaoContract(options.daoAcc, options.accountId);

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

export async function daoListProposals(options: Record<string, any>): Promise<void> {

  const dao = getDaoContract(options.daoAcc, options.accountId);

  const result = await dao.view("get_proposals", { from_index: 0, limit: 50 });

  console.log(inspect(result, false, 5, true));

}
export async function daoProposePayout(amount: number, options: Record<string, any>): Promise<void> {
  /*let env:string='';
  let dao_factory:string='';
  console.log(options);
  if (options.Env=='mainnet'){
    env='near';
    dao_factory='sputnik-dao';
  }else if (options.Env=='testnet'){
    env='testnet';
    dao_factory='sputnikv2';
  }else{
    throw new Error("This is not a valid network");
  }
  if(!options.daoAcc){ throw new Error("It's required DAO name as <DaoName>.daofactory.testnet"); }
  let dao_account = options.daoAcc+'.'+dao_factory+'.'+env*/
  let dao_account = options.daoAcc;
  const dao = getDaoContract(dao_account, options.account);
  let yocto_amount = ntoy(amount);
  console.log(yocto_amount);
  const addProposalCall = await dao.call("add_proposal", {
    proposal: {
      //target: TARGET_REMOTE_UPGRADE_CONTRACT_ACCOUNT,
      description: "propose a payout",
      kind: {
        Transfer: {
          receiver_id: options.accountId,
          token_id: "", //default for basic $NEAR
          amount: yocto_amount,
        }
      }
    }
  }, 200, ONE_NEAR.toString());

  console.log(inspect(addProposalCall, false, 5, true));

}
export async function daoProposeTokenFarm(token_name: string,token_symbol: string, token_amount: number, options: Record<string, any>): Promise<void> {

  if (options.daoAcc == null) {
    throw Error(`You need to provide a DAO account using --daoAcc`);
  }
  let dao_acc:string=options.daoAcc+".sputnikv2.testnet";
  let yocto_amount = ntoy(token_amount);
  console.log(yocto_amount);
  const token_args = { 
    "args": { 
      "owner_id": options.accountId, 
      "total_supply": yocto_amount, 
      "metadata": { 
        "spec": "ft-1.0.0", 
        "name": token_name, 
        "symbol": token_symbol, 
        "icon": "", 
        "decimals": 18 } 
      } 
    };
  const token_args_base_64 = encodeBase64(decodeUTF8(JSON.stringify(token_args)));

  const dao = getDaoContract(options.daoAcc, options.accountId);
  const addProposalCall = await dao.call("add_proposal", {
    proposal: {
      //target: TARGET_REMOTE_UPGRADE_CONTRACT_ACCOUNT,
      description: "Farming " + token_amount + " units of a new token: " + token_name,
      kind: {
        FunctionCall: {
          receiver_id: "tokenfactory.testnet",
          actions: [
            {
              method_name: "create_token",
              args: token_args_base_64,
              deposit: "5000000000000000000000000",
              gas: "150000000000000"
            }
          ]
        }
      }
    }
  }, 200, ONE_NEAR.toString());

  console.log(inspect(addProposalCall, false, 5, true));

}
export async function daoProposeCouncil(council: string, options: Record<string, any>): Promise<void> {

  const dao = getDaoContract(options.daoAcc, options.accountId);
  //In case that remove option was called
  let addProposalCall;
  if (options.remove) {
    addProposalCall = await dao.call("add_proposal", {
      proposal: {
        description: "Remove council member",
        kind: {
          RemoveMemberFromRole: {
            member_id: council,
            role: options.role
          }
        }
      }
    }, 200, ONE_NEAR.toString());

  } else {
    addProposalCall = await dao.call("add_proposal", {
      proposal: {
        description: "Adding a new council",
        kind: {
          AddMemberToRole: {
            member_id: council,
            role: options.role
          }
        }
      }
    }, 200, ONE_NEAR.toString());
  }

  console.log(inspect(addProposalCall, false, 5, true));

}
export async function daoProposeCall(DaoId: string, MethodCall: string, ArgsCall: string, options: Record<string, any>): Promise<void> {

  console.log(options.env);
  /*let env:string='';
  let dao_factory:string='';
  if (options.env=='mainnet'){
    env='near';
    dao_factory='sputnik-dao';
  }else if (options.env=='testnet'){
    env='testnet';
    dao_factory='sputnikv2';
  }else{
    throw new Error("This is not a valid network");
  }
  let dao_account = options.daoAcc+'.'+dao_factory+'.'+env*/
  let dao_account = options.daoAcc;
  const dao = getDaoContract(options.daoAcc, options.account);

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
          actions: [{ method_name: MethodCall, args: encodeBase64(decodeUTF8(ArgsCall)), deposit: "0", gas: "200000000000000" }]
        }
      }
    }
  }, 200, ONE_NEAR.toString());

  console.log(inspect(addProposalCall, false, 5, true));

}
export async function daoProposePolicy(policyFile: string, options: Record<string, any>): Promise<void> {
  const new_policy: JSON = JSON.parse(fs.readFileSync(policyFile, 'utf8'));
  const dao = getDaoContract(options.daoAcc, options.accountId);
  console.log(new_policy);
  const addProposalCall = await dao.call("add_proposal", {
    proposal: {
      //target: TARGET_REMOTE_UPGRADE_CONTRACT_ACCOUNT,
      description: "Propose an upgrade of policy",
      kind: {
        ChangePolicy: {
          policy: new_policy,
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

  const dao = getDaoContract(options.daoAcc, options.accountId);
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
  //note: all commander args are strings

  const dao = getDaoContract(options.daoAcc, options.accountId);
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
  //note: all commander args are strings

  const dao = getDaoContract(options.daoAcc, options.accountId);
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

