import * as near from "near-api-lite/lib/near-rpc.js";
import { SmartContract, yton, ytonb, ytonFull } from "near-api-lite";
import { formatLargeNumbers, showNumbers } from "../util/format-near";
import { configSigner, getMetaPoolContract, OPERATOR_ACCOUNT, showContractAndOperator } from "../util/setup";

import { Command } from "commander";

// command list sub-commands
export async function listUsers(options: Record<string, any>, _command: Command): Promise<void> {
  return list_full_users_info(options["fix"]);
}

export async function listSp(options: Record<string, any>, _command: Command): Promise<void> {
  return list_full_sp_info(options["rebuild"]);
}

//
// UTILITY: rebuild_stakes after contract data deletion
//
async function _rebuild_stakes() {
  //rebuild_stake_from_pool_information
  const metaPool = getMetaPoolContract();
  const pools = await metaPool.get_staking_pool_list();
  for (let inx = 0; inx < pools.length; inx++) {
    const pool = pools[inx];
    console.log(`about to REBUILD STAKE INFO on pool[${inx}]:${JSON.stringify(pool)}`);
    try {
      await metaPool.call("rebuild_stake_from_pool_information", { sp_inx: inx });
      //distribute_rewards es -> void
    }
    catch (ex) {
      console.error(ex);
    }
  }
}
  
//
// UTILITY: list full sp info
//
async function list_full_sp_info(rebuild:boolean) {
  //show full info
  
  const metaPool = getMetaPoolContract();
  const contractState = await metaPool.get_contract_state();
  
  const stakingPool = new SmartContract("");
  configSigner(stakingPool,OPERATOR_ACCOUNT);
  
  const our_sums= {
    sum_staked: 0n,
    sum_unstaked: 0n,
    total_in_pools: 0n,
  };
  const sp_sums= {
    sp_sum_staked: 0n,
    sp_sum_unstaked: 0n,
    total_in_pools: 0n,
  };
  
  const withUnstake = process.argv.includes("unstake");
  
  const pools = await metaPool.get_staking_pool_list();
  
  for (let inx = 0; inx < pools.length; inx++) {
    const pool = pools[inx];
    console.log(inx,"-------------------",pool.account_id );
    const shouldHave =  BigInt(contractState.total_for_staking)*BigInt(pool.weight_basis_points)/10000n;
    console.log("has:",yton(pool.staked), "   should have:",ytonb(shouldHave), "   delta:",ytonb(BigInt(pool.staked)-shouldHave));
  
    if (!withUnstake || BigInt(pool.unstaked)>1000) showNumbers(pool);
  
    our_sums.sum_staked += BigInt(pool.staked);
    our_sums.sum_unstaked += BigInt(pool.unstaked);
    try {
      stakingPool.contract_account = pool.account_id;
      const theirData = await stakingPool.view("get_account", { account_id: metaPool.contract_account });
      if (theirData.staked_balance!=pool.staked) console.log("***DIFFER STAKED");
      if (theirData.unstaked_balance!=pool.unstaked) console.log("***DIFFER UN-STAKED");
        
      if (!withUnstake || BigInt(theirData.unstaked_balance)>1000) showNumbers(theirData);
  
      sp_sums.sp_sum_staked += BigInt(theirData.staked_balance);
      sp_sums.sp_sum_unstaked += BigInt(theirData.unstaked_balance);
      if (rebuild){
        if (theirData.staked_balance!=pool.staked || theirData.unstaked_balance!=pool.unstaked ){
          console.log("-- ** REBUILD data");
          await metaPool.rebuild_stake_from_pool_information(pool.inx, theirData.staked_balance, theirData.unstaked_balance);
          console.log("-- ** ------------");
        }
      } 
    }
    catch (ex) {
      console.error(ex);
    }
  }
  console.log("-- sp sums ------------------");
  sp_sums.total_in_pools = sp_sums.sp_sum_staked + sp_sums.sp_sum_unstaked;
  showNumbers(sp_sums);
  
  console.log("-- our sums ------------------");
  our_sums.total_in_pools = our_sums.sum_staked + our_sums.sum_unstaked;
  showNumbers( our_sums );
  
  console.log("---CHECK");
  showCompareValues("total-in-pools",sp_sums.total_in_pools, our_sums.total_in_pools);
  showCompareValues("our sums unstaked_and_waiting",our_sums.sum_unstaked, BigInt(contractState.total_unstaked_and_waiting));
  
  if (rebuild){
    if ( sp_sums.sp_sum_staked.toString() != contractState.total_actually_staked  || sp_sums.sp_sum_unstaked.toString() != contractState.total_unstaked_and_waiting ){
      console.log("-- ** REBUILD sum data");
      await metaPool.rebuild_contract_staked(sp_sums.sp_sum_staked.toString(), sp_sums.sp_sum_unstaked.toString());
      console.log("-- ** ------------");
    }
  } 
}
  
function showCompareValues(title:string, sum:bigint, contract:bigint){
  const line = `${sum!=contract? "ERR":"OK "} ${title.padEnd(20)}: sum:${sum}, contract:${contract}, dif:${sum-contract}`;
  console.log(formatLargeNumbers(line));
}
  
//
// UTILITY: list full users info
//
async function list_full_users_info(fix:boolean) {
  
  try {
  
    const metaPool = getMetaPoolContract();
    const contractState = await metaPool.get_contract_state();
  
    const userCount = Number(await metaPool.get_number_of_accounts());
    console.log(`${userCount} Accounts`);
  
    const withUnstake = process.argv.includes("unstake");
  
    const peopleSums={
      available: 0n,
      unstaked: 0n,
      unstaked_can_withdraw : 0n,
      stake_shares: 0n,
      stnear: 0n,
    };
  
    const BATCH=50;
    let start = 0;
    while (start < userCount) {
      const accounts = await metaPool.get_accounts_info(start, BATCH);
      for (let inx = 0; inx < accounts.length; inx++) {
        const accountInfo = accounts[inx];
        console.log(start+inx, accountInfo.account_id, yton(accountInfo.meta));
        //FIX
        // if (fix && accountInfo.available!="0") {
        //   if (accountInfo.account_id!="treasury.meta.pool.testnet"
        //     && accountInfo.account_id!="..NSLP.."
        //     && accountInfo.account_id!="operator.meta.pool.testnet"
        //     && accountInfo.account_id!="developers.near"
        //   ) {
        //     await metaPool.stake_available(accountInfo.account_id);
        //   }
        // }
        //--end fix
  
        let show=false;
        if (accountInfo.can_withdraw && accountInfo.unstaked!="0") {
          peopleSums.unstaked_can_withdraw += BigInt(accountInfo.unstaked);
          show=true;
        }
        if (accountInfo.available!="0") {
          show=true;
        }
        if (withUnstake && accountInfo.unstaked!="0") {
          show=true;
        }
        
        if (show) {
          console.log("-------------------");
          showNumbers(accountInfo);
        }
  
        peopleSums.available += BigInt(accountInfo.available);
        peopleSums.unstaked+= BigInt(accountInfo.unstaked);
        peopleSums.stake_shares += BigInt(accountInfo.stake_shares );
        peopleSums.stnear+= BigInt(accountInfo.stnear);
      }
      start += BATCH;
    }
    const account = await near.queryAccount(metaPool.contract_account);
    const _nativeBalance  = BigInt(account.amount);
    console.log("---CONTRACT");
    const deltaStake = BigInt(contractState.total_for_staking) - BigInt(contractState.total_actually_staked);
    const extraPendingToStake = deltaStake>0? deltaStake : 0n;
    const _extraPendingUnstake = deltaStake<0? -deltaStake : 0n;
    showNumbers(contractState);
    console.log("---PEOPLE SUMS");
    showNumbers(peopleSums);
    console.log("---CHECK ACCOUNTS");
    showCompareValues("Available",peopleSums.available, BigInt(contractState.total_available));
    showCompareValues("stake shares",peopleSums.stake_shares, BigInt(contractState.total_stake_shares));
    console.log("people unstaked_can_withdraw",yton(peopleSums.unstaked_can_withdraw.toString()));
    console.log("contract retrieved          ",yton(contractState.reserve_for_unstake_claims));
    if (peopleSums.unstaked_can_withdraw>BigInt(contractState.reserve_for_unstake_claims)) {
      console.log("STILL NOT RETRIEVED? ----- people unstaked_can_withdraw > contractState.reserve_for_unstake_claims");
    }
    // const total_actually_unstaked_and_retrieved_should_be = peopleSums.unstaked - extraPendingUnstake - BigInt(contractState.total_unstaked_and_waiting)
    // console.log("--- contractState.reserve_for_unstake_claims        is:", contractState.reserve_for_unstake_claims)
    // console.log("--- contractState.reserve_for_unstake_claims should be:", total_actually_unstaked_and_retrieved_should_be)
    console.log("----");
    console.log(" deltaStake:",yton(deltaStake.toString()));
    console.log("---ACCOUNT native balance:");
    console.log(yton(account.amount));
    console.log("---CONTRACT internal accounting balance:");
    const contract_balance = BigInt(contractState.contract_account_balance);
    console.log(yton(contractState.contract_account_balance));
    console.log(`OVER nslp.available (+treasury?): ${yton((contract_balance-peopleSums.available).toString())}`);
    // check contract balance
    if (contract_balance<peopleSums.available) {
      console.log("ERR----- contract_balance<nslp.available (+treasury?)");
    }
    //COMMENTED CANT BE COMPUTED LIKE THAT
    // const shouldBeByAccounts = peopleSums.available + extraPendingToStake  + (peopleSums.unstaked - extraPendingUnstake) - BigInt(contractState.total_unstaked_and_waiting)
    // console.log(` nat bal should be (to cover accounts available & unstaked): ppl avail ${ytonFull(peopleSums.available.toString())} + extraPendingToStake ${ytonFull(extraPendingToStake.toString())} + (accounts.unstaked ${ytonFull(peopleSums.unstaked.toString())} - extraPendingUnstake) - total_unstaked_and_waiting ${ytonFull(contractState.total_unstaked_and_waiting)}: ${ytonFull(shouldBeByAccounts.toString())}`)
    // const differAcc = nativeBalance - shouldBeByAccounts
    // console.log("DIFFER by accounts (30% txn fee?):",ytonFull(differAcc.toString())) 
    // console.log("----")
    // what the contract has + delta-stake + how much we retrieved from the pools
    const shouldBeThereByContract = BigInt(contractState.total_available) + extraPendingToStake + BigInt(contractState.reserve_for_unstake_claims); 
    console.log(`OVER contract.available + extraPendingToStake ${ytonb(extraPendingToStake)} + reserve_for_unstake_claims ${yton(contractState.reserve_for_unstake_claims)}: ${ytonb(contract_balance-shouldBeThereByContract)}`);
    if (contract_balance<shouldBeThereByContract) {
      console.log("ERR----- contract_balance<shouldBeByContract");
    }
  
    //console.log(` nat bal should be (contract.unstaked_and_retrieved): liq ${ytonFull(contractState.total_available)} + extraPendingToStake ${ytonFull(extraPendingToStake.toString())} + unstaked_and_retrieved ${ytonFull(contractState.reserve_for_unstake_claims)} - total_unstaked_and_waiting ${ytonFull(contractState.total_unstaked_and_waiting)}: ${ytonFull(shouldBeByContract.toString())}`)
    // console.log(` nat bal should be (contract.unstaked_and_retrieved): liq ${ytonFull(contractState.total_available)} + extraPendingToStake ${ytonFull(extraPendingToStake.toString())} + unstaked_and_retrieved ${ytonFull(contractState.reserve_for_unstake_claims)} : ${ytonFull(shouldBeThereByContract.toString())}`)
    // const differByContract = nativeBalance - shouldBeThereByContract
    // console.log("DIFFER by contract (30% txn fee?):",ytonFull(differByContract.toString()))
  
    console.log("DIFF with native (30% txn fee?):",ytonFull((BigInt(account.amount)-contract_balance).toString())); 
    // showCompareValues("differs",differAcc , differByContract )
  
    showContractAndOperator(metaPool);
  
    if (fix) {
      console.log("--FIXING based on PEOPLE SUMS unstaked");
      await metaPool.call("rebuild_contract_available",{
        total_available: contractState.total_available,
        total_unstake_claims: peopleSums.unstaked.toString(),
        reserve_for_unstake_claims: peopleSums.unstaked.toString()
      }, 5);
    }
  
  }
  catch (ex) {
    console.error(ex);
  }
}
  
  