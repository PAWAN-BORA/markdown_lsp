
interface Message {
  jsonrpc:"2.0"
}

export interface RequestMessage extends Message {
  method:string,
  id:number,
  params?:unknown,

}
export interface ResponseMessage extends Message {
  id:number|null,
  result?:unknown,
  error?:unknown,
}
export interface NotificationMessage extends Message {
  method:string,
  params?:unknown,
}
export function encodeMessage(msg:ResponseMessage):string{
  const msgStr = JSON.stringify(msg);
  return `Content-Length: ${msgStr.length}\r\n\r\n${msgStr}`
}

export function decodeMessage(bytes:Uint8Array):RequestMessage|NotificationMessage{

  try {

    const [headerBytes, contentBytes] = splitBytes(bytes, "\r\n\r\n");
    const decoder = new TextDecoder();
    const header = decoder.decode(headerBytes);
    const contentLength = Number(header.split("Content-Length:")[1]);
    if(isNaN(contentLength)){
      throw new Error("Content Length Not Found!")
    }
    const content = decoder.decode(contentBytes.subarray(0, contentLength));
    try {
      return JSON.parse(content);
    } catch {
      throw new Error("Invalid Json")
    }
  } catch(err) {
    throw err;
  }

}

export function splitBytes(bytes:Uint8Array, seprator:string):[Uint8Array, Uint8Array]{
  const encoder = new TextEncoder();
  const separatorBytes = encoder.encode(seprator);
  let index = -1;
  for(let i=0; i<bytes.length - separatorBytes.length; i++){
    let match = true;
    for(let j=0; j<separatorBytes.length; j++){
      if(bytes[i+j]!==separatorBytes[j]){
        match = false;
        break;
      }
    }
    if(match){
      index = i;
      break;
    }
  }
  if(index==-1){
    throw new Error("Seperator not found!")
  }
  return [bytes.subarray(0, index), bytes.subarray(index+separatorBytes.length, bytes.length)]

}
