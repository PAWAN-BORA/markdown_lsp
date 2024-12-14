import { Logger } from "../logger.ts";
import { TextEdit, CodeAction, Position, Range } from "./types.ts";


export function getHoverWord(text:string, position:Position):string{


  const [word] =  getPositionWord(text, position);
  return word;

}

export function getDefinitionPosition(text:string, position:Position):Position{

  const [word, lines] = getPositionWord(text, position);
  for(let i=0; i<position.line; i++){
    const line = lines[i];
    let currWord = ""
    for(let j=0; j<line.length; j++){
      const char = line[j]
      if(char!==" "){
        currWord += char;
      }
      if(char==" " || j==line.length-1){
        if(currWord.toLowerCase()==word.toLowerCase()){
          return {line:i, character:j - (currWord.length-1) }
        }
        currWord = "";
      } 
    }
  }
  return position;

}

export function getCodeActionList(text:string, uri:string):CodeAction[]{
  const result:CodeAction[] = [];

  const lines = text.split("\n");

  const charSeparator = [" ", ":", "[", "]", "(", ")", "."]
  const wordObj = {current:"typescript", replace:"javascript"}
  const httpObj = {current:"http", replace:"https"}
  const typeScriptChanges:{[uri:string]:TextEdit[]} = {};
  const httpChanges:{[uri:string]:TextEdit[]} = {};
  for(let i=0; i<lines.length; i++){
    const line = lines[i];
    let currWord = "";
    for(let j=0; j<line.length; j++){
      const char = line[j];
      const isSeparator = charSeparator.includes(char);
      if(!isSeparator){
        currWord += char;
      }
      if(isSeparator || j==line.length){
        const range:Range = {
          start:{line:i, character:j-currWord.length},
          end:{line:i, character:j},
        }
        if(currWord.toLowerCase()==wordObj.current){
          if(typeScriptChanges[uri]==undefined){
            typeScriptChanges[uri] = [{range:range, newText:wordObj.replace}]
          } else {
            typeScriptChanges[uri].push({range:range, newText:wordObj.replace})
          }
        } else if(currWord.toLowerCase()==httpObj.current){
          if(httpChanges[uri]==undefined){
            httpChanges[uri] = [{range:range, newText:httpObj.replace}]
          } else {
            httpChanges[uri].push({range:range, newText:httpObj.replace})
          }
        }
        currWord = "";
      }
    }
  }
  if(typeScriptChanges[uri]!=undefined){
    result.push({
      title:'replace typescript with javascript',
      edit:{
        changes:typeScriptChanges
      }
    })
  } 
  if(httpChanges[uri]!=undefined){
    result.push({
      title:'replace http with https',
      edit:{
        changes:httpChanges
      }
    })
  }
  return result;

}

function getPositionWord(text:string, position:Position):[string, string[]]{
  let word = "";
  const lines = text.split("\n");
  const curLine = lines[position.line];
  const breakChar = [" ", ":", "[", "]", "(", ")", "."]
  if(curLine==undefined) return ["", lines];
  for(let i=position.character; i>=0; i--){
    const char = curLine[i];
    if(breakChar.includes(char))break;
    word = char + word;
  }
  for(let i=position.character+1; i<curLine.length; i++){
    const char = curLine[i];
    if(breakChar.includes(char))break;
    word = word + char;
  }
  return [word, lines];

}
