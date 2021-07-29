import SimpleParser from "../syntaxAnalysis/SimpleParser";
import readline from "readline";

const EXIT_REPL_TOKEN = "exit();";
const REPL_END_TOKEN = ";";

const VERBOSE_STATUS_ARGV = "-v";

export default class SimpleScript {
  private REPL: readline.Interface;

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
      console.log(input);
      if (input === EXIT_REPL_TOKEN) {
        this.closeREPL();
        return;
      }
      let simpleParser = new SimpleParser();

      const ast = simpleParser.parse(input);

      simpleParser.dumpAST(ast, "");
      process.stdout.write(`>`);
    });
  }

  closeREPL() {
    console.log("good bye~");
    this.REPL.close();
  }
}
