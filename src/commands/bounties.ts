import { SmartContract, ntoy, yton, encodeBase64, decodeUTF8, ONE_NEAR, encodeBase58 } from "near-api-lite";
import { readFileSync, appendFileSync } from "fs";
import { inspect } from "util";
import { configSigner,multiConfigSigner, getDaoContract, getNetworkEnding, TARGET_REMOTE_UPGRADE_CONTRACT_ACCOUNT } from "../util/setup";


export async function daoAddBounty( amount:number, options: Record<string, any>): Promise<void> {

    let dao_account = options.daoAcc;
    const dao = getDaoContract(dao_account,options.accountId);
    let yocto_amount = ntoy(amount);
    let claims = parseInt(options.times);
    let deadline = "1000";
    console.log(yocto_amount);
    const addBountyCall = await dao.call("add_proposal", {
      proposal: {
        //target: TARGET_REMOTE_UPGRADE_CONTRACT_ACCOUNT,
        description: "propose a bounty",
        kind: {
          AddBounty: {
            bounty:{
              //receiver_id: options.accountId,
              description: "propose a bounty",
              token: "", //default for basic $NEAR
              amount: yocto_amount,
              times: claims,
              max_deadline: deadline,
            }
          }
        }
      }
    }, 200, ONE_NEAR.toString());
    console.log(inspect(addBountyCall, false, 5, true));
}

export async function daoGetBounties(options: Record<string, any>): Promise<void> {
  
  const dao = getDaoContract(options.daoAcc,options.accountId);
  const result = await dao.view("get_bounties", { from_index: 0, limit: 50 });
  let idbounty:number = options.id;

  if(idbounty != null){
    console.log(inspect(result[idbounty], false, 5, true));
  }else{
    console.log(inspect(result, false, 5, true));
  }
}

export async function daoBountyClaim( id:string, options: Record<string, any>): Promise<void> {
  
  let deadline = "1000";
  let idbounty:number = parseInt(id);
  const dao = getDaoContract(options.daoAcc,options.accountId);
  const result = await dao.call("bounty_claim",{
      id: idbounty,
      deadline: deadline,
  }, 200, ONE_NEAR.toString());
  console.log("Bounty Claimed");
  console.log(inspect(result));
}

export async function daoBountyGiveup( id:string, options: Record<string, any>): Promise<void> {

  let idbounty:number = parseInt(id);
  const dao = getDaoContract(options.daoAcc,options.accountId);
  const result = await dao.call("bounty_giveup",{
      id: idbounty,
  }, 200);
  console.log("Bounty Give Up");
  console.log(inspect(result));
  
}

export async function daoBountyDone( id:string, options: Record<string, any>): Promise<void> {

  let idbounty:number = parseInt(id);
  let dao_account = options.daoAcc;
  const dao = getDaoContract(dao_account,options.accountId);
  //let yocto_amount = ntoy(amount);
  let claims = parseInt(options.times);
  let deadline = "1000";
  //console.log(yocto_amount);
  const bountyDoneCall = await dao.call("add_proposal", {
    proposal: {
      description: "bounty realiced",
      kind: {
        BountyDone: {
          bounty_id: idbounty,
          receiver_id: options.accountId,
        }
      }
    }
  }, 200, ONE_NEAR.toString());
  console.log(inspect(bountyDoneCall, false, 5, true));
  console.log("Under development");
}