import SimpleLexer from "./src/lexicalAnalysis/SimpleLexer";

let simpleLexer = new SimpleLexer();

const tokens = simpleLexer.tokenizer("a * 2");

console.log(tokens);
