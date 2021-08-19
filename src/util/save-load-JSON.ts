import {writeFileSync,readFileSync} from "fs";

export function saveJSON<T>(data:T):void {
  writeFileSync("persistent.json", JSON.stringify(data));
}

export function loadJSON<T>():T {
  try {
    const buff = readFileSync("persistent.json");
    return JSON.parse(buff.toString()) as T;
  }
  catch (ex) {
    console.error(ex.message);
    return {} as T;
  }
}
