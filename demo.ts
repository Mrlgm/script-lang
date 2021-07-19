import SimpleParser from "./src/syntaxAnalysis/SimpleParser";

let simpleParser = new SimpleParser();

const ast = simpleParser.parse("int a = 2 + 3*4");

simpleParser.dumpAST(ast, "");
