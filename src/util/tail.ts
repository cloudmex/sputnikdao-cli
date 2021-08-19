import * as fs from "fs";

const TAIL_SIZE = 64 * 1024;
// read the last TAIL_SIZE bytes from a file
// return as string
export function tail(filename: string): string {

  try {
    const st = fs.statSync(filename);
    const f = fs.openSync(filename,"r");
    const buffer = Buffer.alloc(TAIL_SIZE);
    const bytesRead = fs.readSync(f, buffer, 0, TAIL_SIZE, st.size - TAIL_SIZE);
    fs.closeSync(f);
    if (bytesRead) {
      const newLinePos = buffer.indexOf(10);
      if (newLinePos >= 0) {
        return buffer.slice(newLinePos + 1).toString("utf8");
      }
    }
    return "-NO DATA-";
  }
  catch (ex) {
    return "ERR at tail(" + filename + ") " + ex.message;
  }
}
