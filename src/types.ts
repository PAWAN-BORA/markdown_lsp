
export interface InitializeParams {
  workDoneToken:number|string
  processId:number | null,
  clientInfo?:{
    name?:string,
    version?:string,
  }
}

export interface InitializeResult {
  capabilities: ServerCapabilities,
  serverInfo?:{
    name:string,
    version?:string,
  }
}


interface ServerCapabilities {

  hoverProvider:boolean,
}
