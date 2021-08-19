import {ytonFull} from "near-api-lite";
import { inspect } from "util";

/**
 * adds _ to a string number 
 * @param {string} str
 */
function addThousandsSep(str:string) {
  if (str.length > 3) {
    let n = str.indexOf(".");
    if (n < 0)
      n = str.length;
    n -= 4;
    while (n >= 0) {
      str = str.slice(0, n + 1) + "_" + str.slice(n + 1);
      n = n - 3;
    }
  }
  return str;
}

function asDecimalPart(str:string) {
  str = str.replace(/_/g, "");
  while (str.endsWith("0"))
    str = str.slice(0, -1);
  return "." + str;
}

export function formatLargeNumbers(text:string):string {
  const largeNumbersFound = text.match(/\d{9,50}/g);
  if (largeNumbersFound) {
    largeNumbersFound.sort();
    for(let i=largeNumbersFound.length-1;i>=0;i--){
      const match=largeNumbersFound[i];
      text = text.replace(new RegExp(match, "g"), ytonFull(match));
    }
  }
  return text;
}

export function formatLargeNumbers_underscore(text:string):string {
  const largeNumbersFound = text.match(/\d{9,50}/g);
  if (largeNumbersFound) {
    largeNumbersFound.sort();
    for(let i=largeNumbersFound.length-1;i>=0;i--){
      const matches=largeNumbersFound[i];
      if (matches.replace(/0/g, "")) { //not all zeroes
        let replacement = addThousandsSep(matches);
        if (replacement.endsWith("_000".repeat(8))) {
          replacement = replacement.slice(0, -32) + "e24";
        }
        else if (replacement.endsWith("_000".repeat(6))) {
          replacement = replacement.slice(0, -32) + asDecimalPart(replacement.slice(-32,-24)) + "e24";
        }
        else if (replacement.endsWith("_000".repeat(4))) {
          replacement = replacement.slice(0, -16) + "e12";
        }
        text = text.replace(new RegExp(matches, "g"), replacement);
      }
    }
  }
  return text;
}

export function showNumbers(json: unknown):void {
  console.log(formatLargeNumbers(inspect(json)));
}
  
  