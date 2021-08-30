#!/usr/bin/env node

import { program } from "commander";


import { inspect } from "util";
import * as near from "near-api-lite/lib/near-rpc.js";
import { formatLargeNumbers, showNumbers } from "./util/format-near.js";
import { getDaoContract, METAPOOL_CONTRACT_ACCOUNT} from "./util/setup.js";
import { deleteFCAK } from "./commands/delete-keys.js";
import { testCall } from "./commands/test-call.js";
import { daoCreate, daoDeployCode, daoGetPolicy, daoInfo, daoInit, daoListHash, daoListProposals, daoProposePayout, daoProposeUpgrade, daoProposeCall,daoProposeCouncil, daoRemoveBlob, daoRemoveProposal, daoVoteApprove, daoVoteUnapprove, daoVoteReject } from "./commands/dao.js";
import { SmartContract } from "near-api-lite";

main(process.argv, process.env);

async function main(argv: string[], _env: Record<string, unknown>) {

  near.setLogLevel(1);

  program
  .command("create <name> <council>")
  .option("--policy <policy>", "Asign a policy")
  .option("--bond <bond>", "Asign bond","1000000000000000000000000")
  .option("--metadata <meta>", "Asign metadata","")
  .option("--accountId <accountId>", "Use account as signer")
  .option("--purpose <purpose>", "Give a purpose to DAO","Sputnik V2 DAO")
  .option("-env <env>", "Use account as signer","testnet")
  .action(daoCreate);

  program
    .command("info")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .action(daoInfo);

  program
    .command("get_policy")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--update <update>", "Update using new policy")
    .action(daoGetPolicy);

  const dao_propose = program.command("proposal");
  
  dao_propose
    .command("upgrade <wasmFile>")
    .option("-k, --skip", "skip storing the code blob first (if you've already uploaded the code)")
    .description("propose upgrading the meta-pool contract code")
    .action(daoProposeUpgrade);
  
  dao_propose
    .command("payout <amount>")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--accountId <accountId>", "Use account as signer (Who is requesting the payout)")
    .option("-env <env>", "Use account as signer","testnet")
    .description("Add a new proposal for payout")
    .action(daoProposePayout);
  
  dao_propose
    .command("council <council>")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--accountId <accountId>", "Use account as signer (Who is requesting the payout)")
    .option("--remove", "Indicate to remove the council member")
    .option("-env <env>", "Use account as signer","testnet")
    .description("Add a new proposal for payout")
    .action(daoProposeCouncil);

  dao_propose
    .command("tokenfarm <name> <amount>")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .option("--accountId <accountId>", "Use account as signer (Who is requesting the payout)")
    .option("-env <env>", "Use account as signer","testnet")
    .description("Add a new proposal for payout")
    .action(daoProposePayout);

  dao_propose
    .command("call <DaoId> <MethodCall> <ArgsCall>")
    .description("propose calling to a SC method")
    .option("--factoryId <factoryId>","Choose a differente DAO factory: dao.<factoryId>.testnet","sputnikv2")
    .option("--targetId <targetId>","Choose target smartcontract for calling")
    .option("--env <env>", "Choose an environment, options: testnet, mainnet","testnet")
    .action(daoProposeCall); 


  // dao command and sub-commands

  const dao = program.command("dao");

  dao
    .command("init")
    .action(daoInit);

  dao
    .command("deploy-code")
    .action(daoDeployCode);


  const dao_vote = program.command("vote")

  dao_vote
    .command("approve <proposal-index>")
    .option("-a, --accountId <account>", "use account as signer")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .action(daoVoteApprove);

  dao_vote
    .command("unapprove <proposal-index>")
    .option("-a, --accountId <account>", "use account as signer")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .action(daoVoteUnapprove);

    dao_vote
      .command("reject <proposal-index>")
      .option("-a, --accountId <account>", "use account as signer")
      .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
      .action(daoVoteReject);

  const dao_list = program
    .command("list")
    .description("list items from DAO");

  dao_list
    .command("proposals")
    .description("list proposals")
    .option("--daoAcc <daoAcc>", "NEAR ID of DAO Account that is receiving the proposal")
    .action(daoListProposals);

  dao_list
    .command("hash <wasmFile>")
    .description("compute file hash to check if blob is stored in the DAO")
    .action(daoListHash);

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

  //other functionality -----------

  program
    .command("test-call")
    .action(testCall);

  program
    .command("test-version")
    .action(async () => {
      const testContract = new SmartContract("test.pool.testnet")
      //configSigner(testContract, OPERATOR_ACCOUNT)
      console.log(await testContract.view("get_block_index", {}));
      console.log(await testContract.view("get_version", {}));

    });

  program
    .command("delete-FCAK")
    .action(deleteFCAK);

  program.parse(argv);

}

