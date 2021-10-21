import { SmartContract, ntoy, yton, encodeBase64, decodeUTF8, ONE_NEAR, encodeBase58 } from "near-api-lite";
import { readFileSync, appendFileSync } from "fs";
import { inspect } from "util";
import { getDaoContract, getFactoryContract, getRandomInt, getSmartContract, TOKEN_FACTORY_TESTNET } from "../util/setup";
import * as fs from 'fs';
import * as sha256 from "near-api-lite/lib/utils/sha256.js";
import { option } from "commander";
import * as network from "near-api-lite/lib/network.js";
import BN = require('bn.js');

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
  
  const initStakingCall = await staking_contract.call("new", {
    token_id,
    owner_id: options.daoAcc,
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
  //const dao = getDaoContract(options.daoAcc, options.accountId);
  const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);
  
  const addProposalCall = await dao.call("add_proposal", {
    proposal: {
      //target: TARGET_REMOTE_UPGRADE_CONTRACT_ACCOUNT,
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

//Get DAO token balance
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
//Get DAO token balance
export async function getStakingContract(options: Record<string, any>): Promise<void> {
  network.setCurrent(options.network);

  //const dao = getDaoContract(options.daoAcc, options.accountId);
  const dao = getDaoContract(options.daoAcc,options.accountId,options.factory, options.network);

  const result = await dao.view("get_staking_contract");

  console.log(inspect(result, false, 5, true));

}
/*
export async function initStakingContract(staking_id:string, token_id: string, options: Record<string, any>): Promise<void> {
  const factory = getStakingContract(staking_id, options.accountId);
  const initStakingCall = await factory.call("new", {
    token_id,
    owner_id: options.daoAcc,
    unstake_period: "604800000000000"
  }, 200);

  console.log(inspect(initStakingCall, false, 5, true));
  
  const storageStaking = await factory.call("new", {
    token_id,
    owner_id: options.daoAcc,
    unstake_period: "604800000000000"
  }, 200);

  console.log(inspect(storageStaking, false, 5, true));
}*/