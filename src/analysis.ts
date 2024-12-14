import { Position } from "./types.ts";


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
