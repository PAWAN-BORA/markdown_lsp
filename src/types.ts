
export interface InitializeParams {
  workDoneToken:number|string
  processId:number | null,
  clientInfo?:{
    name?:string,
    version?:string,
  }
}


interface ServerCapabilities {

  hoverProvider:boolean,
  textDocumentSync:number,
  definitionProvider:boolean,

}
export interface InitializeResult {
  capabilities: ServerCapabilities,
  serverInfo?:{
    name:string,
    version?:string,
  }
}


interface TextDocumentIdentifier {
	uri: string;
}

export interface Position {
  line:number,
  character:number,
}
export interface TextDocumentPositionParams {
  textDocument:TextDocumentIdentifier,
  position:Position
}
export interface HoverParams extends TextDocumentPositionParams {

}
export interface DefinitionParams extends TextDocumentPositionParams {

}
export interface Range {
  start:Position,
  end:Position
}

interface TextDocumentItem {
	uri: string;
	languageId: string;
	version: number;
	text: string;
}

export interface DidOpenTextDocumentParams {
	textDocument: TextDocumentItem;
}
interface VersionedTextDocumentIdentifier extends TextDocumentIdentifier {
	version: number;
}
interface TextDocumentContentChangeEvent {
  text:string,
}
export interface DidChangeTextDocumentParams {
	textDocument: VersionedTextDocumentIdentifier;
	contentChanges: TextDocumentContentChangeEvent[];
}
export interface DidSaveTextDocumentParams {
	textDocument: TextDocumentIdentifier;
	text?: string;
}


