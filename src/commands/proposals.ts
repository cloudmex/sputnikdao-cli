import { SmartContract, ntoy, encodeBase64, decodeUTF8, ONE_NEAR, encodeBase58, yton } from "near-api-lite";
import { readFileSync, appendFileSync } from "fs";
import { inspect } from "util";
import { configSigner, multiConfigSigner, getDaoContract,getSmartContract, SPUTNIK_WASM_PATH, SPUTNIK_FACTORY_MAINNET, SPUTNIK_FACTORY_TESTNET, TOKEN_FACTORY_MAINNET, TOKEN_FACTORY_TESTNET, ONE_TENTH_OF_NEAR } from "../util/setup";
import * as fs from 'fs';
import * as sha256 from "near-api-lite/lib/utils/sha256.js";
import * as network from "near-api-lite/lib/network.js";

//Propose the upgrade of a remote contract
  export async function daoProposeUpgrade(wasmFile: string, targetId:string, options: Record<string, any>): Promise<void> {
    network.setCurrent(options.network);
    const wasmInfo = getBlobHash(wasmFile);
  
    const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);
  
    if (!options.skip) {
      //store the blob
      const resultBase58Hash = await dao.call("store_blob", wasmInfo.bytes, 200, ntoy(wasmInfo.requiredStorageNears));
      //console.log(inspect(resultHash, false, 5, true));
      //save hash result
      appendFileSync("./blobs.json", JSON.stringify({ wasmFile: wasmFile, base58Hash: resultBase58Hash }));
    }
  
    let description: string;
    if (options.description != null) {
      description = options.description;
    } else {
      description = "Upgrade code";
    }

    const addProposalResult = await dao.call("add_proposal", {
      proposal: {
        target: targetId,
        description: description,
        kind: {
          UpgradeRemote: {
            receiver_id: targetId,
            method_name: "upgrade",
            hash: encodeBase58(wasmInfo.hash),
          }
        }
      }
    }, 200, ONE_TENTH_OF_NEAR.toString());
  
    console.log(inspect(addProposalResult, false, 5, true));
  
  }

//Propose the upgrade of  DAO contract
//Recovers the wasm file located at res/  
  export async function daoProposeSelfUpgrade(options: Record<string, any>): Promise<void> {
    network.setCurrent(options.network);
    
    const wasmInfo = getBlobHash(SPUTNIK_WASM_PATH);
  
    const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);
    if (!options.skip) {
      //store the blob
      const resultBase58Hash = await dao.call(
        "store_blob", 
        wasmInfo.bytes, 
        200, 
        ntoy(wasmInfo.requiredStorageNears));
        
      //save hash result
      appendFileSync("./blobs.json", JSON.stringify({ 
        wasmFile: SPUTNIK_WASM_PATH, 
        base58Hash: resultBase58Hash 
      }));
    }
    console.log(wasmInfo.hash);
      //Send proposal for self upgrading DAO
    const addProposalResult = await dao.call("add_proposal", {
      proposal: {
        description: "Self upgrade code of DAO",
        kind: {
          UpgradeSelf: {
            hash: encodeBase58(wasmInfo.hash),
          }
        }
      }
    }, 200, ONE_TENTH_OF_NEAR.toString());
  
    console.log(inspect(addProposalResult, false, 5, true));
    
  }

//Propose a poll inside DAO
//I.E. "Is good to have a pool?"
//DAO council can vote approve or unapprove
  export async function daoProposePoll(question: string, options: Record<string, any>): Promise<void> {
    network.setCurrent(options.network);
    
    const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);
  
    const addProposalResult = await dao.call("add_proposal", {
      proposal: {
        description: question,
        kind: "Vote"
      }
    }, 200, ONE_TENTH_OF_NEAR.toString());
  
    console.log(inspect(addProposalResult, false, 5, true));
  
  }

// Propose a payout
//It can be a custom FT using --token <token_id>
export async function daoProposePayout(amount: number, options: Record<string, any>): Promise<void> {
    network.setCurrent(options.network);
    let dao_account = options.daoAcc;
    
    const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);
    
    //console.log(ONE_TENTH_OF_NEAR.toString());
    let yocto_amount = ntoy(amount);
    //Propose a parget
    const target_id = (options.target!=null) ? options.target : options.accountId;
    const token_id = (options.token=="") ?  "" : options.token + "." + TOKEN_FACTORY_TESTNET ;
    
    //Compare if the token is not $NEAR (default)
    if(options.token!=""){
      const token_contract = getSmartContract(token_id,options.accountId);
      const storageCall = await token_contract.call("storage_deposit", {
        //account_id: target_id,
      }, 100, ONE_NEAR.toString());
    
      console.log(inspect(storageCall, false, 5, true));
      yocto_amount = ntoy(amount/1000000);
    }
    //Do a proposal for payout of tokens
    const addProposalCall = await dao.call("add_proposal", {
      proposal: {
        description: "propose a payout",
        kind: {
          Transfer: {
            receiver_id: target_id,
            token_id, //default for basic $NEAR
            amount: yocto_amount,
          }
        }
      }
    }, 200, ONE_TENTH_OF_NEAR.toString());
  
    console.log(inspect(addProposalCall, false, 5, true));
  
  }

// Farms a new token
//Payout is sended to DAO
//You can set token name, symbol and amount
  export async function daoProposeTokenFarm(token_name: string,token_symbol: string, token_amount: number, options: Record<string, any>): Promise<void> {
    network.setCurrent(options.network);
    if (options.daoAcc == null) {
      throw Error(`You need to provide a DAO account using --daoAcc`);
    }
    console.log(token_amount);
    let yocto_amount = ntoy(token_amount/100000);
    console.log(yocto_amount);
  
    const owner_id = (options.targetId!=undefined) ? options.targetId : options.daoAcc+".sputnikv2.testnet";
    const token_args = { 
      "args": { 
        "owner_id": owner_id, 
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
    const token_factory=(options.network=="mainnet") ? TOKEN_FACTORY_MAINNET: TOKEN_FACTORY_TESTNET;
    
    const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);
    const addProposalCall = await dao.call("add_proposal", {
      proposal: {
        description: "Farming " + token_amount + " units of a new token: " + token_name +" to "+owner_id,
        kind: {
          FunctionCall: {
            receiver_id: token_factory,
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
    }, 100, ONE_TENTH_OF_NEAR.toString());
  
    console.log(inspect(addProposalCall, false, 5, true));
  
  }

//Propose to add a new council
  export async function daoProposeCouncil(council: string, options: Record<string, any>): Promise<void> {
    network.setCurrent(options.network);
  
    const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);
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
      }, 200, ONE_TENTH_OF_NEAR.toString());
  
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
      }, 200, ONE_TENTH_OF_NEAR.toString());
    }
  
    console.log(inspect(addProposalCall, false, 5, true));
  
  }
  
// Propose a remote call to target contract
  export async function daoProposeCall(targetId: string, methodCall: string, argsCall: string, options: Record<string, any>): Promise<void> {
    network.setCurrent(options.network);
  
    let dao_account = options.daoAcc;
    const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);
  
    console.log(methodCall);
    console.log(argsCall);
  
    const addProposalCall = await dao.call("add_proposal", {
      proposal: {
        description: "propose a calling a method to target contract",
        kind: {
          FunctionCall: {
            receiver_id: targetId,
            actions: [{ method_name: methodCall, args: encodeBase64(decodeUTF8(argsCall)), deposit: "0", gas: "100000000000000" }]
          }
        }
      }
    }, 100, ONE_TENTH_OF_NEAR.toString());
  
    console.log(inspect(addProposalCall, false, 5, true));
  
  }

// Propose the upgrade of a policy
// it is send as a JSON file
  export async function daoProposePolicy(policyFile: string, options: Record<string, any>): Promise<void> {
    network.setCurrent(options.network);
    
    const new_policy: JSON = JSON.parse(fs.readFileSync(policyFile, 'utf8'));
    const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);
    console.log(new_policy);
    const addProposalCall = await dao.call("add_proposal", {
      proposal: {
        description: "Propose an upgrade of policy",
        kind: {
          ChangePolicy: {
            policy: new_policy,
          }
        }
      }
    }, 200, ONE_TENTH_OF_NEAR.toString());
  
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