import { Node } from "../type";
import { TokenNode, TokenType } from "./tokenizer";

/**
 * 语法分析
 * 把程序的结构识别出来，并形成一棵便于计算机处理的抽象语法树
 * 使用递归下降的算法实现
 *
 * @param token token数组
 */
export default function parser(token: Node[]) {}

export function intDeclare(tokens: TokenNode[]) {
  let node = new SimpleASTNode();
  let token = tokens[0];
  if (token !== null && token.type === TokenType.Int) {
    token = tokens.shift(); // 消掉int
    if (tokens[0].type === TokenType.Identifier) {
      token = tokens.shift(); // 消掉 id
      node = new SimpleASTNode(ASTNodeType.VariableDeclaration, token.value);
      token = tokens[0];
      if (token !== null && token.type == TokenType.Assignment) {
        tokens.shift();
        const child: SimpleASTNode = additive(tokens);
        if (child === null) {
          throw new Error(
            "invalide variable initialization, expecting an expression"
          );
        } else {
          node.addChild(child);
        }
      } else {
        throw new Error("variable name expected");
      }
    }
  }

  return node;
}

function additive(tokens: TokenNode[]): SimpleASTNode {
  let token = tokens[0];
  let node = null;
  if (token !== null && token.type === TokenType.IntLiteral) {
    node = new SimpleASTNode(ASTNodeType.Literal, token.value);
  }
  return node;
}

class SimpleASTNode {
  parent = null;
  children = [];
  nodeType: ASTNodeType = ASTNodeType.Program;
  text: string = null;

  constructor(nodeType?: ASTNodeType, text?: string) {
    nodeType && (this.nodeType = nodeType);
    text && (this.text = text);
  }

  addChild(node: SimpleASTNode) {
    this.children.push(node);
  }
}

enum ASTNodeType {
  VariableDeclaration = "VariableDeclaration",
  Literal = "Literal",
  Program = "Program",
}
