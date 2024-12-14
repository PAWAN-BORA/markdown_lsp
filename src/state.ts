import { Logger } from "../logger.ts";
import { RequestMessage, ResponseMessage, encodeMessage } from "../rpc.ts";
import { getDefinitionPosition, getHoverWord } from "./analysis.ts";
import { DefinitionParams, DidChangeTextDocumentParams, DidOpenTextDocumentParams, DidSaveTextDocumentParams, HoverParams, InitializeParams, InitializeResult, Location, Range } from "./types.ts";

export class State{

  private logger:Logger;
  private writer = Deno.stdout
  private documents:Map<string, string> = new Map();
  constructor(logger:Logger){
    this.logger = logger;
  } 
  handleRequest(request:RequestMessage){
    switch(request.method) {
      case "initialize": {
        // const params = request.params as InitializeParams;
        const response = this.initializeResponse(request.id)
        this.writeResponse(response)
        break;
      } 
      case "initialized":{
        this.logger.info(`Connected!`);
        break;
      }
      case "textDocument/didOpen": {
        const params= request.params as DidOpenTextDocumentParams;
        // this.logger.info(params.textDocument.languageId);
        this.addOrUpdateDocument(params.textDocument.uri, params.textDocument.text);
        break;
      }
      case "textDocument/didChange": {
        const params= request.params as DidChangeTextDocumentParams;
        for(const content of params.contentChanges){
          this.addOrUpdateDocument(params.textDocument.uri, content.text);
        }
        break;
      }
      case "textDocument/didSave": {
        this.logger.info(`Document Saved!`);
        break;
      }
      case "textDocument/didClose": {
        const params= request.params as DidSaveTextDocumentParams;
        this.removeDocument(params.textDocument.uri);
        break;
      }
      case "textDocument/hover": {
        const params = request.params as HoverParams;
        const response = this.hoverResponse(request.id, params)
        this.writeResponse(response)
        break;
      }
      case "textDocument/definition": {
        this.logger.info(`Document definition!`);
        const params = request.params as DefinitionParams;
        const response = this.definationResponse(request.id, params)
        this.writeResponse(response)
        break;
      }

    }
  }
  private initializeResponse(id:number):ResponseMessage{
    interface InitializeResponse extends Omit<ResponseMessage, "result"> {
      result:InitializeResult
    }
    const result:InitializeResponse = {
      jsonrpc:"2.0",
      id:id,
      result:{
        capabilities:{
          hoverProvider:true,
          textDocumentSync:1,
          definitionProvider:true,
        },
        serverInfo:{
          name:"markdown_lsp",
          version:"0.0.1"
        }
      }
    }
    return result;
  }
  private hoverResponse(id:number, params:HoverParams){

    interface HoverResponse extends Omit<ResponseMessage, "result"> {
      result:{
        contents:string,
        range?:Range,
      }
    }
    const uri = params.textDocument.uri;
    const position = params.position;

    const currDocument = this.documents.get(uri);
    const word = getHoverWord(currDocument ?? "", position);
    const result:HoverResponse = {
      jsonrpc:"2.0",
      id:id,
      result:{
        contents:`File: \`${uri}\`
Characters: ${currDocument?.length}
Word: ${word}`,
      }
    }
    return result;
  }

  private definationResponse(id:number, params:DefinitionParams) {

    interface DefinitionResponse extends Omit<ResponseMessage, "result"> {
      result:{
        uri:string,
        range:Range,
      }
    }
    const uri = params.textDocument.uri;
    const position = params.position;
    const currDocument = this.documents.get(uri);
    const definitionPosition = getDefinitionPosition(currDocument??"", position);
    this.logger.info(`defi_pos ${JSON.stringify(definitionPosition)}`)
    this.logger.info(`curr_pos ${JSON.stringify(position)}`)
    const result:DefinitionResponse = {
      jsonrpc:"2.0",
      id:id,
      result:{
        uri:uri,
        range:{
          start:definitionPosition,
          end:definitionPosition
        }
      }
    }
    return result;
  }
  private writeResponse(msg:ResponseMessage){
    const reply = encodeMessage(msg);
    this.writer.write(new TextEncoder().encode(reply));
  }
  private addOrUpdateDocument(uri:string, text:string){
    this.documents.set(uri, text)
  }
  private removeDocument(uri:string){
    this.documents.delete(uri);
  }
}
