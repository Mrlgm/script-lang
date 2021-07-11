import { intDeclare } from "./compiler/parser";
import tokenizer from "./compiler/tokenizer";

export default class Lang {
  constructor(code: string) {
    const tokens = tokenizer(code);
    console.log(tokens);
    const node = intDeclare(tokens)
    console.log(node)
  }
}
