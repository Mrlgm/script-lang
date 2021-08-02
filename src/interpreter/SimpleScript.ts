import SimpleParser from "../syntaxAnalysis/SimpleParser";
import readline from "readline";
import { SimpleASTNode } from "../syntaxAnalysis/ASTNode";
import { ASTNodeType } from "../syntaxAnalysis/enum/ASTNodeType";
import VariableMap from "../variableMap/VariableMap";

const EXIT_REPL_TOKEN = "exit();";
const REPL_END_TOKEN = ";";

const VERBOSE_STATUS_ARGV = "-v";

export default class SimpleScript {
  private REPL: readline.Interface;
  private verbose = false;
  private variables = new VariableMap();

  constructor() {
    this.initREPL();
    this.startREPL();
  }

  initREPL() {
    this.REPL = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  startREPL() {
    process.stdout.write(`Let's test your script language~ Please input \n\n>`);
    this.REPL.on("line", (input) => {
      if (input === VERBOSE_STATUS_ARGV) {
        this.verbose = true;
        process.stdout.write(`>`);
        return;
      }

      if (input === EXIT_REPL_TOKEN) {
        this.closeREPL();
        return;
      }

      try {
        let simpleParser = new SimpleParser();
        const ast = simpleParser.parse(input);
        this.evaluate(ast, "");
      } catch (err) {
        console.log(err.message);
      }

      process.stdout.write(`>`);
    });
  }

  closeREPL() {
    console.log("good bye~");
    this.REPL.close();
  }

  evaluate(node: SimpleASTNode, indent: string) {
    let result: number;
    if (this.verbose) {
      console.log(indent + "Calculating: " + node.nodeType);
    }
    let child1: SimpleASTNode, child2: SimpleASTNode;
    let value1: number, value2: number;
    let varName: string;
    switch (node.nodeType) {
      case ASTNodeType.Program:
        for (const child of node.children) {
          this.evaluate(child, indent);
        }
        break;
      case ASTNodeType.Additive:
        child1 = node.children[0];
        value1 = this.evaluate(child1, indent + "\t");
        child2 = node.children[1];
        value2 = this.evaluate(child2, indent + "\t");

        if (node.text === "+") {
          result = value1 + value2;
        } else {
          result = value1 - value2;
        }
        break;
      case ASTNodeType.Multiplicative:
        child1 = node.children[0];
        value1 = this.evaluate(child1, indent + "\t");
        child2 = node.children[1];
        value2 = this.evaluate(child2, indent + "\t");
        if (node.text === "*") {
          result = value1 * value2;
        } else {
          result = value1 / value2;
        }
        break;
      case ASTNodeType.Literal:
        result = Number(node.text);
        break;
      case ASTNodeType.Identifier:
        varName = node.text;
        if (this.variables.containsKey(varName)) {
          let value = this.variables.get(varName);
          if (value !== null) {
            result = Number(value);
          } else {
            throw new Error(
              "variable " + varName + " has not been set any value"
            );
          }
        } else {
          throw new Error("unknown variable: " + varName);
        }
        break;
      case ASTNodeType.AssignmentStmt:
        varName = node.text;
        if (!this.variables.containsKey(varName)) {
          throw new Error("unknown variable: " + varName);
        }
      case ASTNodeType.VariableDeclaration:
        varName = node.text;
        let varValue = null;
        if (node.children.length > 0) {
          let child = node.children[0];
          result = this.evaluate(child, indent + "\t");
          varValue = Number(result);
        }
        this.variables.put(varName, varValue);
        break;
    }

    if (this.verbose) {
      console.log(indent + "Result: " + result);
    } else if (indent === "") {
      if (
        node.nodeType === ASTNodeType.AssignmentStmt ||
        node.nodeType === ASTNodeType.VariableDeclaration
      ) {
        console.log(node.text + ":" + result);
      } else if (node.nodeType !== ASTNodeType.Program) {
        console.log(result);
      }
    }

    return result;
  }
}
