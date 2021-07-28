import SimpleParser from "./src/syntaxAnalysis/SimpleParser";

let simpleParser = new SimpleParser();

const ast = simpleParser.parse("int age = 2 + 3; (age + 6) * 4;");

simpleParser.dumpAST(ast, "");
