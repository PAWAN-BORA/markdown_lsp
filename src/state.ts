import { Logger } from "../logger.ts";
import { RequestMessage, ResponseMessage, encodeMessage } from "../rpc.ts";
import { InitializeParams, InitializeResult } from "./types.ts";

export class State{

  private logger:Logger;
  private writer = Deno.stdout
  constructor(logger:Logger){
    this.logger = logger;
  } 
  handleRequest(request:RequestMessage){
    switch(request.method) {
      case "initialize": {
        const params = request.params as InitializeParams;
        const response = this.initializeResponse(request.id, params)
        this.writeResponse(response)
        break;
      } case "initialized":{
        this.logger.info(`Connected!`);
        break;
      }

    }
  }
  private initializeResponse(id:number, params:InitializeParams):ResponseMessage{
    interface InitializeResponse extends Omit<ResponseMessage, "params"> {
      result:InitializeResult
    }
    const result:InitializeResponse = {
      jsonrpc:"2.0",
      id:id,
      result:{
        capabilities:{
          hoverProvider:true,
        },
        serverInfo:{
          name:"markdown_lsp",
          version:"0.0.1"
        }
      }
    }
    return result;
  }
  private writeResponse(msg:ResponseMessage){
    const reply = encodeMessage(msg);
    this.writer.write(new TextEncoder().encode(reply));
  }
}
