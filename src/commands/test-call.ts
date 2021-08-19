import { setLogLevel, SmartContract, yton } from "near-api-lite";
import { configSigner } from "../util/setup";

export async function testCall(): Promise<void> {

  const testContract = new SmartContract("test.pool.testnet")
  configSigner(testContract,"lucio.testnet")

  setLogLevel(2);

  const result = await testContract.call("test_callbacks",{});
  
  console.log("balance = ", yton(result));
  
  console.log("2**128 = ", BigInt(2)**BigInt(128));

}
//                      u128::MAX =  340282366920938463463374607431768211456
//is_promise_success:true big_amount:340282366920938463463374607431768211455 big_amount(nears):340282366920938 balance:101183414733512210556567418182