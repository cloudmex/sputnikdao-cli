// ---------------
// UTILITY: list validators
// compose a list of sane validators and some points to compute percentages

import * as near from "near-api-lite/lib/near-rpc.js";
import {configSigner, OPERATOR_ACCOUNT} from "../util/setup.js";

import { SmartContract, yton } from "near-api-lite";
import { getMetaPoolContract } from "../util/setup";
import { StakingPoolJSONInfo } from "../contracts/meta-pool-structs.js";
import { Command } from "commander";
import BN from 'bn.js';


const BLOCK_PRODUCER_KICKOUT_THRESHOLD = 0.9;


// ---------------
export async function listValidators(options: Record<string, any>, _command: Command):Promise<void> {
  return list_validators(options["update"]);
}

// ---------------
type PoolInfo = {
    name: string;
    slashed: boolean;
    stake_millions: number,
    stake: bigint,
    uptime: number,
    fee: number,
    ourStake?: bigint,
    currentPct?: number;
    points: number;
    bp?: number;
  }

//Create interfaces for validators
  export interface CurrentEpochValidatorInfo {
    account_id: string;
    public_key: string;
    is_slashed: boolean;
    stake: string;
    shards: number[];
    num_produced_blocks: number;
    num_expected_blocks: number;
}

export interface NextEpochValidatorInfo {
    account_id: string;
    public_key: string;
    stake: string;
    shards: number[];
}


//sort validators
function sortCompare(a: PoolInfo, b: PoolInfo) {
  if (a.stake > b.stake) return -1;
  return 1;
}
/*

epochReward[t]	= coinbaseReward[t] + epochFee[t]
coinbaseReward[t]	= REWARD_PCT_PER_YEAR / EPOCHS_A_YEAR
REWARD_PCT_PER_YEAR	0.05
EPOCHS_A_YEAR =	730 epochs

Formula recovered from 
https://nomicon.io/Economics/README.html#validator-selection

*/


//Find seat price
//Number of seats is always = 100 ( 1 shard )
function findSeatPrice(validators: (CurrentEpochValidatorInfo | NextEpochValidatorInfo)[], numSeats: number): BN {
  const stakes = validators.map(v => new BN(v.stake, 10)).sort((a, b) => a.cmp(b));
  const num = new BN(numSeats);
  const stakesSum = stakes.reduce((a, b) => a.add(b));
  
  if (stakesSum.lt(num)) {
      throw new Error('Stakes are below seats');
  }
  
  // assert stakesSum >= numSeats
  let left = new BN(1), right = stakesSum.add(new BN(1));
  while (!left.eq(right.sub(new BN(1)))) {
      const mid = left.add(right).div(new BN(2));
      let found = false;
      let currentSum = new BN(0);
      for (let i = 0; i < stakes.length; ++i) {
          currentSum = currentSum.add(stakes[i].div(mid));
          if (currentSum.gte(num)) {
              left = mid;
              found = true;
              break;
          }
      }
      if (!found) {
          right = mid;
      }
  }
  return left;
}

// ---------------
async function list_validators(updateList: boolean) {
  
  const metaPool = getMetaPoolContract();
  
  //make initial pool-list based on current_validators
  const MILLION = BigInt(10 ** 6);
  
  let sumStakes = BigInt(0);

  let upperLimitStake_millions:number = 0;
  let totalStake_millions:number = 0;
  
  const validators = await near.getValidators();

  console.log("Current validators: ",validators.current_validators.length);
  console.log("Current proposals: ",validators.current_proposals.length);

  //A list with all of those validators that
  // produced the number of blocks expected in current T
  //
  // IMPORTANT: There is a threshold for this? A= Yes, it's 0,9
  //
  let fullProposalValidators: any[]=[];
  for(const item of validators.current_validators) {
    if(item.num_produced_blocks>=item.num_expected_blocks*BLOCK_PRODUCER_KICKOUT_THRESHOLD){
      fullProposalValidators.push(item);
    }
  }
  //Current validators are concatenated with current proposals
  let concat = fullProposalValidators.concat(validators.current_proposals);
  //console.log(concat.length);

  //Duplicated validators are removed from array
  let filteredProposals = concat.filter((arr, index, self) =>index === self.findIndex((t) => (t.account_id === arr.account_id)))
  console.log("Filtered proposals: ",filteredProposals.length);
  
  //Current seat price is calculated 
  //Is required to calculate the next seat price (T+1)
  //For removing those validators that will not enter
  //in next round
  let seatPrice:any = Math.round(yton(await findSeatPrice(fullProposalValidators,100).toString()))/ (1e6);

  let seatNextPrice:any = Math.round(yton(await findSeatPrice(validators.next_validators,100).toString()))/ (1e6);

  console.log("Seat price: ",seatPrice);
  console.log("Next seat price: ",seatNextPrice);

  const initialList: PoolInfo[] = [];
  const curedList: PoolInfo[] = [];

  //Limits for the top 33.33% of staking is calculated
  //This for preventing using the validators in the top
  //Preventing centralizing near network using 
  //less acumulative validators
  for (const item of validators.current_validators){
    upperLimitStake_millions += Math.round(yton(item.stake)) / (3*1e6);
    totalStake_millions += Math.round(yton(item.stake)) / 1e6;

  }
  
  console.log("Total staked", totalStake_millions);
  console.log("33% of total staked (Upper limit): ",upperLimitStake_millions);
  //console.log(validators.current_validators)
  for (const item of validators.current_validators) {
  
    const uptime = Math.round(item.num_produced_blocks / item.num_expected_blocks * 100);
    const stake = BigInt(item.stake);
    const stake_millions = Math.round(yton(item.stake)) / 1e6

    initialList.push({
      name: item.account_id,
      slashed: item.is_slashed,
      stake_millions: stake_millions,
      stake: stake,
      uptime: uptime,
      fee: 10,
      points: 0
    }); 
  }
  initialList.sort(sortCompare);
  //console.log(initialList);

  //is removed the 33% of validators that are in top
  //for preventing centrilizing NEAR chain
  let flagUpperLimitStake_millions = 0;

  for(const item of initialList){
    const stake = BigInt(item.stake);
    //console.log("Upper limit {}, current {}",item.uptime,flagUpperLimitStake_millions, upperLimitStake_millions, item.stake_millions, item.stake)
    
    if(flagUpperLimitStake_millions>upperLimitStake_millions){
      //only include uptime>95 && stake>2 MILLION
      //console.log("Down limit"); 
      if (item.uptime > 95 && item.stake_millions > seatNextPrice) {
        sumStakes += item.stake;
        curedList.push(item);
        //console.log("Pushed");  
      }
    }else{
      //console.log("Upper limit"); 
    }
    flagUpperLimitStake_millions += item.stake_millions;

  }
  //console.log(curedList);

  const stakingPool = new SmartContract("");
  configSigner(stakingPool,OPERATOR_ACCOUNT);
  
  const newList: PoolInfo[] = [];
  //query fees to refine the list more
  for (const item of curedList) {
    console.log("Cured list elements ", item.name);
    stakingPool.contract_account = item.name;
    try {
      const rewardFeeFraction = await stakingPool.view("get_reward_fee_fraction");
      item.fee = rewardFeeFraction.numerator * 100 / rewardFeeFraction.denominator;
    }
    catch (ex) {
      //Validator is not a staking-pool contract
      console.log(item.name + " did not respond to get_reward_fee_fraction");
      continue;
    }
  
    try {
      const ourStake = await stakingPool.view("get_account_total_balance", { account_id: metaPool.contract_account });
      item.ourStake = BigInt(ourStake);
    }
    catch (ex) {
      //Validator is not a staking-pool contract
      console.log(item.name + " did not respond to get_account_total_balance");
      continue;
    }
  
    const MAX_FEE = 10;
    if (item.fee > MAX_FEE) {
      console.log(`${item.name} has a fee>${MAX_FEE}, ${item.fee}`);
      continue;
    }
  
    newList.push(item);
  
  }
  //console.log(newList);
  
  //compute % based on our stake
  const contractState = await metaPool.get_contract_state();
  const totalStake = BigInt(contractState.total_actually_staked);
  
  //use fee & order (stake) to determine points
  let _order = 0;
  let totalPoints = 0;
  for (const item of newList) {
    item.points = 1000 - Number(item.stake * 1000n / sumStakes) + 1000 - (item.fee * 100);
    totalPoints += item.points;
    if (item.ourStake) item.currentPct = Math.round(Number(item.ourStake / totalStake * 10000n)) / 100;
    _order++;
  }
  
  //use points to determine pct
  let sum_bp = 0;
  for (const item of newList) {
    item.bp = Math.round(item.points / totalPoints * 10000);
    sum_bp += item.bp;
  }
  //mak the sum 100%
  const lastItem = newList[newList.length - 1];
  lastItem.bp = 10000 - (sum_bp - (lastItem.bp || 0));
  
  //console.log(newList);
  console.log("--Total: " + newList.length + " selected");
  
  //check sum
  sum_bp = 0;
  for (const item of newList) {
    sum_bp += item.bp || 0;
  }
  if (sum_bp != 10000) throw Error("sum!=100%");
  
  //end list construction
  
  if (updateList) {
  
    //UPDATE contract list
    console.log("-------------------");
    console.log("-- UPDATING LIST --");
    console.log("-------------------");
  
    const actual: Array<StakingPoolJSONInfo> = await metaPool.get_staking_pool_list();
    for (const listed of newList) {
      if (listed.bp == undefined) continue;
  
      const foundSp = actual.find(e => e.account_id == listed.name);
      if (!foundSp) { //new one
        console.log(`[new] ${listed.name}, ${listed.bp / 100}%`);
        await metaPool.set_staking_pool(listed.name, listed.bp);
      }
      else { //found
        if (foundSp.weight_basis_points != listed.bp) {
          //update
          console.log(`[${foundSp.inx}] change BP, ${foundSp.account_id}  ${foundSp.weight_basis_points / 100}% -> ${listed.bp / 100}%`);
          await metaPool.set_staking_pool_weight(foundSp.inx, listed.bp);
        }
        else {
          console.log(`[${foundSp.inx}] no change ${foundSp.account_id}  ${foundSp.weight_basis_points / 100}%`);
        }
      }
    }
  
    //set bp=0 for the ones no longer validating or on the list
    for (const sp of actual) {
      const foundListed = newList.find(e => e.name == sp.account_id);
      if (!foundListed) {
        //not listed
        console.log(`[${sp.inx}] not-listed so BP->0, ${sp.account_id}  ${sp.weight_basis_points / 100}% -> 0%`);
        await metaPool.set_staking_pool_weight(sp.inx, 0);
      }
    }
  
  
  }
  
  //check sum of bp
  const check_bp = await metaPool.sum_staking_pool_list_weight_basis_points();
  console.log(`metaPool.sum_staking_pool_list_weight_basis_points => sum bp = ${check_bp}`);
  if (check_bp != 10000) throw Error("sum bp expected to be 10000, but it is " + check_bp);
  
  
}
// ---------------
// END UTILITY: list validators
// ---------------
  