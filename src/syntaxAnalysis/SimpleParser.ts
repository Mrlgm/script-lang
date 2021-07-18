import { TokenType } from "../lexicalAnalysis/enum/TokenType";
import SimpleLexer from "../lexicalAnalysis/SimpleLexer";
import TokenReader from "../lexicalAnalysis/TokenReader";
import { SimpleASTNode } from "./ASTNode";
import { ASTNodeType } from "./enum/ASTNodeType";

export default class SimpleParser {
  parse(script: string) {
    const lexer = new SimpleLexer();
    const tokens = lexer.tokenizer(script);
    console.log(tokens);
    const rootNode = this.prog(tokens);

    return rootNode;
  }

  prog(tokens: TokenReader) {
    const node = new SimpleASTNode(ASTNodeType.Program, "pwc");
    // const child = additive(tokens);
    // if (child != null) {
    //   node.addChild(child);
    // }

    while (tokens.peek() != null) {
      const child = this.intDeclare(tokens);

      // if (child == null) {
      //     child = expressionStatement(tokens);
      // }

      // if (child == null) {
      //     child = assignmentStatement(tokens);
      // }

      if (child !== null) {
        node.addChild(child);
      } else {
        throw new Error("unknown statement");
      }
    }
    return node;
  }

  intDeclare(tokens: TokenReader) {
    let token = tokens.peek();
    let node: SimpleASTNode = null;
    if (token !== null && token.getType() === TokenType.Int) {
      token = tokens.read();
      if (tokens.peek().getType() === TokenType.Identifier) {
        token = tokens.read();
        node = new SimpleASTNode(
          ASTNodeType.VariableDeclaration,
          token.getValue()
        );
        token = tokens.peek();
        if (token !== null && token.getType() === TokenType.Assignment) {
          tokens.read();
          const child = this.additive(tokens);
          node.addChild(child);
        }
      }
    }

    return node;
  }

  additive(tokens: TokenReader) {
    let token = tokens.peek();
    let node: SimpleASTNode = null;

    if (token !== null && token.getType() === TokenType.IntLiteral) {
      let child1 = new SimpleASTNode(ASTNodeType.Literal, token.getValue());
      node = child1;
      tokens.read();
      token = tokens.peek();
      if (token !== null && token.getType() === TokenType.Push) {
        let child2 = this.additive(tokens);
        node = new SimpleASTNode(ASTNodeType.Additive, token.getValue());
        node.addChild(child1);
        node.addChild(child2);
      }
    }

    return node;
  }
}
