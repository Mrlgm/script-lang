import { evaluate, intDeclare, prog } from "./compiler/parser";
import tokenizer from "./compiler/tokenizer";

export default class Lang {
  intDeclare(code: string) {
    const tokens = tokenizer(code);
    const node = intDeclare(tokens);
    console.dir(JSON.stringify(node));
  }

  prog(code: string) {
    const tokens = tokenizer(code);
    const node = prog(tokens);
    console.dir(JSON.stringify(node));
    evaluate(node, "");
  }
}
