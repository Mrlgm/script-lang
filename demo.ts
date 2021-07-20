import SimpleParser from "./src/syntaxAnalysis/SimpleParser";

let simpleParser = new SimpleParser();

const ast = simpleParser.parse("int a = 2 ");

simpleParser.dumpAST(ast, "");
