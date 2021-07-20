import { TokenType } from "../lexicalAnalysis/enum/TokenType";
import SimpleLexer from "../lexicalAnalysis/SimpleLexer";
import TokenReader from "../lexicalAnalysis/TokenReader";
import { SimpleASTNode } from "./ASTNode";
import { ASTNodeType } from "./enum/ASTNodeType";

export default class SimpleParser {
  parse(script: string) {
    const lexer = new SimpleLexer();
    const tokens = lexer.tokenizer(script);
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

  /**
   * A -> M(+ M)*
   * @param tokens
   * @returns
   */
  additive(tokens: TokenReader) {
    let child1 = this.multiplicative(tokens);
    let token = tokens.peek();
    let node: SimpleASTNode = child1;

    while (true) {
      if (token !== null && token.getType() === TokenType.Push) {
        node = new SimpleASTNode(ASTNodeType.Additive, token.getValue());
        tokens.read();
        let child2 = this.multiplicative(tokens);
        node.addChild(child1);
        node.addChild(child2);
        token = tokens.peek();
        if (token !== null) {
          child1 = node;
        }
      } else {
        break;
      }
    }

    return node;
  }

  /**
   * M -> num | num * M
   * @param tokens
   */
  multiplicative(tokens: TokenReader) {
    let token = tokens.peek();
    let node: SimpleASTNode = null;
    if (token !== null && token.getType() === TokenType.IntLiteral) {
      let child1 = new SimpleASTNode(ASTNodeType.Literal, token.getValue());
      node = child1;
      tokens.read();
      token = tokens.peek();
      if (token !== null && token.getType() === TokenType.Star) {
        tokens.read();
        let child2 = this.multiplicative(tokens);
        node = new SimpleASTNode(ASTNodeType.Multiplicative, token.getValue());
        if (child2 !== null) {
          node.addChild(child1);
          node.addChild(child2);
        }
      }
    }

    return node;
  }

  dumpAST(node: SimpleASTNode, indent: string) {
    console.log(indent + node.nodeType + " " + node.text);
    for (const child of node.children) {
      this.dumpAST(child, indent + "\t");
    }
  }
}
