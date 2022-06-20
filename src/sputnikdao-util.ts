#!/usr/bin/env node

import { program } from "commander";

import * as near from "near-api-lite/lib/near-rpc.js";
import { getTokenBalance, stakingContract, getStakingContract, setStorageStaking, setStorageFt, getStakingBalance, setFTTransferCall, setFTDelegation, getTotalDelegationSupply } from "./commands/staking-contract";
import { daoCreate, daoDeployCode, daoGetPolicy, daoInfo, daoUI, daoListHash, daoListProposals,  daoRemoveBlob, daoVoteApprove, daoVoteUnapprove, daoVoteRemove, login, } from "./commands/dao.js";
import { daoProposePayout, daoProposeUpgrade, daoProposeSelfUpgrade, daoProposeCall,daoProposeCouncil, daoProposePolicy, daoProposeTokenFarm, daoProposePoll } from "./commands/proposals.js";
import { daoGetDaoList, factoryDeployCode } from "./commands/factory.js";
import {daoAddBounty, daoGetBounties,daoBountyClaim, daoBountyGiveup, daoBountyDone} from "./commands/bounties.js";

main(process.argv, process.env);

async function main(argv: string[], _env: Record<string, unknown>) {

  near.setLogLevel(1);

  /*program
    .command("login")
    .description("Login in NEAR Wallet")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(login);*/

  program
    .command("create <name> <council>")
    .description("Create a new Sputnik V2 DAO")
    .option("--policy <policy>", "Asign a policy")
    .option("--bond <bond>", "Asign bond","1000000000000000000000000")
    .option("--metadata <meta>", "Asign metadata","")
    .option("--accountId <accountId>", "Use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("--purpose <purpose>", "Give a purpose to DAO","Sputnik V2 DAO")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(daoCreate);

  program
    .command("info")
    .description("Recovers info from Sputnik V2 DAO")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--accountId <accountId>", "Use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(daoInfo);

  program
    .command("openui")
    .description("Open UI website of Sputnik DAO v2")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .option("--astro", "Pick a network: testnet/mainnet","testnet")
    .action(daoUI);

  program
    .command("get_policy")
    .description("Obtain the voting policy")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--accountId <accountId>", "Use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(daoGetPolicy);

  // Create and initialize a new staking contract
  // Using token_id and dao_id for setup
  program
    .command("staking-contract <token_id>")
    .description("Creates and propose attachment of staking contract")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--key <key>", "Recover NEAR Key using 'near keys <accountId>' command")
    .option("--accountId <accountId>", "Use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(stakingContract);
  //Recovers staking contract
  program
    .command("get-staking")
    .description("Shows attached staking contract")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--key <key>", "Recover NEAR Key using 'near keys <accountId>' command")
    .option("--accountId <accountId>", "Use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(getStakingContract);
    //Recovers staking contract
  program
    .command("get-staking-balance")
    .description("Get staking balance of an account")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--target <target>", "Changes target for creating storage-staking")
    .option("--accountId <accountId>", "Use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(getStakingBalance);

  program
    .command("storage-staking")
    .description("Create an storage deposit for staking contract")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--target <target>", "Changes target for creating storage-staking")
    .option("--accountId <accountId>", "Use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(setStorageStaking);

  program
    .command("storage-ft <token_id>")
    .description("Create an storage deposit for fungible token contract")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--target <target>", "Changes target for creating storage-staking")
    .option("--accountId <accountId>", "Use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(setStorageFt);

  program
    .command("transfer-ft <token_id> <amount>")
    .description("Do a transfer call of FT tokens from token contract to staking contract")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--target <target>", "target for account to pay")
    .option("--accountId <accountId>", "Use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(setFTTransferCall);

  program
    .command("delegate-ft <target_id> <amount>")
    .description("Create an storage deposit for fungible token contract")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--accountId <accountId>", "Use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(setFTDelegation);

    program
      .command("total-delegation-supply")
      .description("Create an storage deposit for fungible token contract")
      .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
      .option("--accountId <accountId>", "Use account as signer")
      .option("--factory <factory>", "Factory deployed")
      .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
      .action(getTotalDelegationSupply);
  program
    .command("token-balance <token_id>")
    .description("Shows token balance of DAO")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--accountId <accountId>", "Use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(getTokenBalance);
/*
  program
    .command("staking-init <staking_id> <token_id>")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--accountId <accountId>", "Use account as signer")
    .action(initStakingContract);
    */

  program
    .command("bounty_claim <idbounty>")
    .description("claim a bounty")
    .option("--deadline <deadline>", "This is equivalent time in days, 1000 is 7 days")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("-a, --accountId <accountId>", "use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(daoBountyClaim);

  program
    .command("bounty_giveup <idBounty>")
    .description("give up to the bounty")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("-a, --accountId <accountId>", "use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(daoBountyGiveup);
  
  program
    .command("deployfactory <factAcc>")
    .description("Create a new factory to create new Daos")
    .option("-a, --accountId <accountId>", "use account as signer")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(factoryDeployCode);


  const dao_propose = program.command("proposal");
  
    dao_propose
      .command("self-upgrade")
      .description("Propose an upgrade of DAO with latest contract version")
      .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
      .option("-a, --accountId <accountId>", "Use account as signer (Who is requesting the payout)")
      .option("--factory <factory>", "Factory deployed")
      .option("-k, --skip", "skip storing the code blob first (if you've already uploaded the code)")
      .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
      .action(daoProposeSelfUpgrade);

    dao_propose
      .command("upgrade <wasmFile> <targetId>")
      .description("Propose the upgrade of an external contract")
      .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
      .option("--description <description>", "Description of the proposal")
      .option("-a, --accountId <accountId>", "Use account as signer (Who is requesting the payout)")
      .option("-k, --skip", "skip storing the code blob first (if you've already uploaded the code)")
      .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
      .action(daoProposeUpgrade);

    dao_propose
      .command("poll <question>")
      .description("Propose a poll")
      .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
      .option("-a, --accountId <accountId>", "Use account as signer (Who is requesting the payout)")
      .option("--factory <factory>", "Factory deployed")
      .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
      .action(daoProposePoll);
    
    dao_propose
      .command("payout <amount>")
      .description("Add a new proposal for payout")
      .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
      .option("-a, --accountId <accountId>", "Use account as signer (Who is requesting the payout)")
      .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
      .option("-t, --target <targetId>", "Target NEAR ID for payment")
      .option("--factory <factory>", "Factory deployed")
      .option("--token <token>", "Pick a token for paying, default is NEAR","")
      .action(daoProposePayout);
    //Method for upgrading DAO policy
    dao_propose
      .command("policy <policyFile>")
      .description("Propose the of upgrade of voting policy through a JSON file")
      .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
      .option("--accountId <accountId>", "Use account as signer (Who is requesting the payout)")
      .option("--factory <factory>", "Factory deployed")
      .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
      .action(daoProposePolicy);

    dao_propose
      .command("addBounty <amount>")
      .description("Add a new proposal for Bounty")
      .option("--times <times>", "How many times this Bounty can be done")
      .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
      .option("-a, --accountId <accountId>", "Use account as signer (Who is requesting the payout)")
      .option("--factory <factory>", "Factory deployed")
      .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
      .action(daoAddBounty);

    dao_propose
      .command("bountyDone <id>")
      .description("Add a new proposal for a BountyDone")
      .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
      .option("-a, --accountId <accountId>", "Use account as signer (Who is requesting the payout)")
      .option("--factory <factory>", "Factory deployed")
      .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
      .action(daoBountyDone);
    
    dao_propose
      .command("council <council>")
      .description("Propose adding a new council member")
      .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
      .option("--accountId <accountId>", "Use account as signer (Who is requesting the payout)")
      .option("--remove", "Indicate to remove the council member")
      .option("--role <role>", "Pick a different role to council member","council")
      .option("--factory <factory>", "Factory deployed")
      .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
      .action(daoProposeCouncil);

    dao_propose
      .command("tokenfarm <token_name> <token_symbol> <token_amount>")
      .description("Propose farm a new token")
      .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
      .option("--targetId <targetId>", "NEAR ID of DAO Account that is receiving the proposal")
      .option("--accountId <accountId>", "Use account as signer (Who is requesting the payout)")
      .option("--factory <factory>", "Factory deployed")
      .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
      .action(daoProposeTokenFarm);

    dao_propose
      .command("call <targetId> <methodCall> <argsCall>")
      .description("propose calling to a SC method")
      .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
      .option("--accountId <accountId>", "Use account as signer")
      .option("--factory <factory>", "Factory deployed")
      .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
      .action(daoProposeCall); 


  // dao command and sub-commands
  /*
  const dao = program.command("dao");


  dao
    .command("deploy-code")
    .action(daoDeployCode);
  */

  const dao_vote = program.command("vote")

  dao_vote
    .command("approve <proposal-index>")
    .option("-a, --accountId <accountId>", "use account as signer")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(daoVoteApprove);

  dao_vote
    .command("unapprove <proposal-index>")
    .option("-a, --accountId <accountId>", "use account as signer")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(daoVoteUnapprove);

    //Pending of rename this command to removal or similar
    dao_vote
      .command("remove <proposal-index>")
      .option("-a, --accountId <accountId>", "use account as signer")
      .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
      .option("--factory <factory>", "Factory deployed")
      .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
      .action(daoVoteRemove);

  const dao_list = program
    .command("list")
    .description("list items from DAO");

  dao_list
    .command("proposals")
    .description("list proposals")
    .option("--from <from>", "use account as signer","0")
    .option("--to <to>", "use account as signer","50")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("-a, --accountId <accountId>", "use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(daoListProposals);


  dao_list
    .command("bounties")
    .description("get a list of bounties")
    .option("--id <id>", "Id to get a specific bounty")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("-a, --accountId <accountId>", "use account as signer")
    .option("--factory <factory>", "Factory deployed")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(daoGetBounties);

  dao_list
    .command("daos <factAcc>")
    .description("get a list of daos from a factory")
    .option("-a, --accountId <accountId>", "use account as signer")
    .option("-n, --network <network>", "Pick a network: testnet/mainnet","testnet")
    .action(daoGetDaoList);

  dao_list
    .command("hash <wasmFile>")
    .description("compute file hash to check if blob is stored in the DAO")
    .action(daoListHash);
/*
  const dao_remove = dao
    .command("remove")
    .description("remove items from metapool's DAO");

  dao_remove
    .command("blob <hash|file.wasm>")
    .description("remove blob by hash")
    .action(daoRemoveBlob);

  dao_remove
    .command("proposal <id>")
    .description("remove proposal by index")
    .action(daoRemoveProposal);
*/
  //other functionality -----------


  program.parse(argv);

}

