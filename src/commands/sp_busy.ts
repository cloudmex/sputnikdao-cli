import { getMetaPoolContract } from "../util/setup";

export async function sp_busy(inxString:string,valueString:string):Promise<void>{
  try {
    const metaPool = getMetaPoolContract();
    const contractState = await metaPool.get_contract_state();
    const inx = Number(inxString);
    if (isNaN(inx) || inx<0 || inx>=contractState.staking_pools_count) {
      throw Error(`invalid sp index 0<${inx}<${contractState.staking_pools_count}`);
    }
    if (valueString!="true" && valueString!="false") {
      throw Error(`invalid value. ${valueString} != true|false`);
    }
    const value = JSON.parse(valueString);
    await metaPool.sp_busy(inx,value);
  }
  catch(ex){
    console.error(ex);
  }
}
  