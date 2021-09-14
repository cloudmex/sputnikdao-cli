import { setLogLevel, SmartContract } from "near-api-lite";
import * as dao from "../commands/dao"

async function main() {

  const testContract = new SmartContract("test.pool.testnet")
  //configSigner(testContract, OPERATOR_ACCOUNT)
  console.log(await testContract.view("get_block_index", {}));
  console.log(await testContract.view("get_version", {}));

  console.log(process.cwd())
  setLogLevel(1)

  const proposal = "9"

  try {
    await dao.daoProposeUpgrade("./res/get_epoch_contract-v2.wasm", { skip: false })
  } catch (ex) {
    if (!ex.message.includes("ERR_ALREADY_EXISTS")) throw ex;
  }
  await dao.daoVoteApprove(proposal, { account: "asimov.testnet" })
  await dao.daoVoteApprove(proposal, { account: "lucio2.testnet" })
  await dao.daoVoteApprove(proposal, { account: "lucio.testnet" })

  //cleanup
  await dao.daoRemoveBlob("./res/get_epoch_contract-v2.wasm")
  await dao.daoRemoveProposal(proposal)

  console.log(await testContract.view("get_block_index", {}));
  console.log(await testContract.view("get_version", {}));
}

main();

