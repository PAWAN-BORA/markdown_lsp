import { Logger } from "./logger.ts";
import { decodeMessage, splitBytes } from "./rpc.ts";
import { State } from "./src/state.ts";


const logger = await Logger.getLogger("/home/pawan/projects/deno/markdown_lsp/logs/log.txt", 'mark_lsp');
async function start(){
  logger.info("server started!")
  const state = new State(logger);
  let buffer = new Uint8Array(0);
  for await (const chunk of Deno.stdin.readable){
    buffer = concatenateUint8Arrays(buffer, chunk)
    try {
      const [headerBytes, contentBytes] = splitBytes(buffer, "\r\n\r\n");
      const decoder = new TextDecoder();
      const header = decoder.decode(headerBytes);
      const contentLength = Number(header.split("Content-Length:")[1]);
      if(isNaN(contentLength)){
        throw new Error("Content Length Not Found!")
      }
      const totalLength = headerBytes.length + 4 + contentBytes.length; 
      if(buffer.length < totalLength){
        continue;
      }
      const request = decodeMessage(buffer.subarray(0, totalLength));
      // logger.info(`getting: ${JSON.stringify(request)}`);
      logger.info(`getting: ${request.method}`);
      state.handleRequest(request);
      buffer = buffer.slice(totalLength);

    } catch(err)  {
      if(err instanceof Error){
        logger.error(err.message)
      }
      continue;

    }
  }
}

start();
function concatenateUint8Arrays(arr1: Uint8Array, arr2: Uint8Array): Uint8Array {
  const combined = new Uint8Array(arr1.length + arr2.length);
  combined.set(arr1);
  combined.set(arr2, arr1.length);
  return combined;
}

// async function getLooger(filename:string) {
//   try{
//     const file = await Deno.open(filename, {write:true, read:true, create:true, append:true,})
//     return new Logger(file, "[markdownlsp]")
//   } catch {
//     throw new Error("Failed to open file.")
//   }
// }

