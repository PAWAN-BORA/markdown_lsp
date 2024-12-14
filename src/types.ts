
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
  codeActionProvider:boolean,
  completionProvider:{[name:string]:unknown},

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
export interface CompletionParams extends TextDocumentPositionParams {

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
// interface CodeActionContext {
//   diagnostics:
// }
export interface CodeActionParams {
  textDocument:TextDocumentIdentifier,
  range:Range,
  context:unknown,
}
export interface TextEdit {
  range:Range,
  newText:string,
}
export interface WorkspaceEdit {
  changes:{
    [uri:string]:TextEdit[],
  }
}
export interface CodeAction {
  title:string,
  edit:WorkspaceEdit,
}
export interface CompletionItem {
  label:string,
  detail:string,
  documentation:string,

}
