import { SmartContract, ntoy, yton, encodeBase64, decodeUTF8, ONE_NEAR, encodeBase58, ytonFull } from "near-api-lite";
import { readFileSync, appendFileSync } from "fs";
import { inspect } from "util";
import { getDaoContract, getFactoryContract, getRandomInt, getSmartContract, TOKEN_FACTORY_TESTNET, SPUTNIK_FACTORY_MAINNET, SPUTNIK_FACTORY_TESTNET } from "../util/setup";
import * as fs from 'fs';
import * as sha256 from "near-api-lite/lib/utils/sha256.js";
import { option } from "commander";
import * as network from "near-api-lite/lib/network.js";
import BN = require('bn.js');

//Deploy a new staking contract and attach it to the DAO
export async function stakingContract(token_id: string, options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);
  const random_num = getRandomInt(0,1000000000);
  const contract_name = "staking-"+random_num.toString();
  const factory = getFactoryContract(undefined, options.accountId);
  const FIVE_NEAR = ONE_NEAR.mul(new BN(5));
  // Create staking contract
  const createStakingCall = await factory.call("create", {
    name: contract_name,
    hash:"4ThdGjTKbBTad45CyePPAiZmWJEpEoFwViFusy4cpEmA",
    "Cg== ": "",
    access_keys: [options.key]
  }, 200, FIVE_NEAR.toString());
  console.log(inspect(createStakingCall, false, 5, true));

  //Initialize staking contract
  const staking_contract = getSmartContract(contract_name+".generic.testnet", options.accountId);
  let dao_acc:string;
  if(options.factory != null){
    //dao_acc = (options.network=="mainnet") ? options.daoAcc+"."+SPUTNIK_FACTORY_MAINNET: options.daoAcc+"."+options.factory;
    dao_acc = options.daoAcc+"."+options.factory;
  }else{
    dao_acc = (options.network=="mainnet") ? options.daoAcc+"."+SPUTNIK_FACTORY_MAINNET: options.daoAcc+"."+SPUTNIK_FACTORY_TESTNET;
  }
  //Is required to have mainnet option in here
  //token_id=token_id+"."+TOKEN_FACTORY_TESTNET
  
  
  const initStakingCall = await staking_contract.call("new", {
    token_id,
    owner_id: dao_acc,
    unstake_period: "604800000000000"
  }, 200);

  console.log(inspect(initStakingCall, false, 5, true));
  console.log("Created and initialized staking contract: " + contract_name+".generic.testnet");
 
  //Initialize staking contract
  const token_contract = getSmartContract(token_id, options.accountId);
  
  const tokenStorageCall = await token_contract.call("ft_balance_of", {
    account_id:contract_name+".generic.testnet"
  }, 200);

  console.log(inspect(tokenStorageCall, false, 5, true));
  console.log("Initialized storage for " + token_id); 
  
  //Generate a new proposal in DAO for 
  //adopting new staking contract
  const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);
  
  const addProposalCall = await dao.call("add_proposal", {
    proposal: {
      description: "Adopt staking contract",
      kind: {
        SetStakingContract: {
          staking_id: contract_name+".generic.testnet",
        }
      }
    }
  }, 200, ONE_NEAR.toString());

  console.log(inspect(addProposalCall, false, 5, true));
  console.log("Added new proposal to DAO for staking contract");
}

//Get DAO token balance of a Fungible Token
export async function getTokenBalance(token_id: string,options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);
  const token = token_id + "." + TOKEN_FACTORY_TESTNET;
  console.log(token);
  const dao = getSmartContract(token, options.accountId);

  const result = await dao.view("ft_balance_of",{
    account_id:options.daoAcc+".sputnikv2.testnet"
  });

  console.log(inspect(result, false, 5, true));

}
//call storage_deposit of staking contract for signer account
export async function setStorageStaking(options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);

  const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);

  const result = await dao.view("get_staking_contract");
  const staking_contract = getSmartContract(result, options.accountId);

  const stake_results = await staking_contract.call("storage_deposit",{

  },undefined,ONE_NEAR.toString());


  console.log(inspect(stake_results, false, 5, true));
  console.log("Storage created succesfully");

}

//call storage_deposit of token contract for signer account
export async function setStorageFt(token_id:string,options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);

  const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);

  const staking_contract = getSmartContract(token_id, options.accountId);
  const account_id = (options.target==undefined) ? options.accountId :options.target;
  const stake_results = await staking_contract.call("storage_deposit",{
    account_id
  },undefined,ONE_NEAR.toString());


  console.log(inspect(stake_results, false, 5, true));
  console.log("Storage created succesfully");

}

//Recovers attached staking contract
export async function getStakingContract(options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);

  const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);

  const result = await dao.view("get_staking_contract");

  console.log(inspect(result, false, 5, true));

}
//Recovers attached total delegation supply
export async function getTotalDelegationSupply(options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);

  const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);

  const result = await dao.view("delegation_total_supply");

  console.log(inspect(result, false, 5, true));

}

//Get staking balance of an account in attached staking contract
export async function getStakingBalance(options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);

  const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);

  const result = await dao.view("get_staking_contract");
  const staking_contract = getSmartContract(result, options.accountId);

  const stake_results = await staking_contract.view("get_user",{
    account_id:options.accountId
  });


  console.log(inspect(stake_results, false, 5, true));

}

//do a transfer call to token contract
export async function setFTTransferCall(token_id:string,amount:number,options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);

  const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);

  const staking_contract = await dao.view("get_staking_contract");
  const token_contract = getSmartContract(token_id, options.accountId);
  const token_amount = ntoy(amount/1000000);
  const stake_results = await token_contract.call("ft_transfer_call",{
    receiver_id:staking_contract,
    amount: token_amount,
    //The message needs to be empty, in other case the contract panics
    msg:"",
  },undefined,"1");


  console.log(inspect(stake_results, false, 5, true));

}


//Delegate tokens for voting power
export async function setFTDelegation(target_id:string,amount:number,options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);

  const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);

  const staking_id = await dao.view("get_staking_contract");
  const staking_contract = getSmartContract(staking_id, options.accountId);
  const token_amount = ntoy(amount/1000000);
  const delegate_results = await staking_contract.call("delegate",{
    account_id: target_id,
    amount: token_amount,
  },undefined);


  console.log(inspect(delegate_results, false, 5, true));

}