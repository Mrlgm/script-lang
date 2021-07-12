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

export function prog(tokens: TokenNode[]) {
  const node = new SimpleASTNode(ASTNodeType.Program, "Calculator");
  const child = additive(tokens);
  if (child != null) {
    node.addChild(child);
  }
  return node;
}

function additive(tokens: TokenNode[]): SimpleASTNode {
  let token = tokens[0];
  let node = null;
  if (token !== undefined && token.type === TokenType.IntLiteral) {
    let child1 = new SimpleASTNode(ASTNodeType.Literal, token.value);
    node = child1;
    tokens.shift();
    token = tokens[0];
    if (token !== undefined && token.type === TokenType.Push) {
      tokens.shift();
      const child2 = additive(tokens);
      if (child2 !== null) {
        node = new SimpleASTNode(ASTNodeType.Additive, token.value);
        node.addChild(child1);
        node.addChild(child2);
      }
    } else {
    }
  }
  return node;
}

export function evaluate(node: SimpleASTNode, indent: string) {
  let result = 0;
  console.log(indent + "Calculating: " + node.nodeType);
  switch (node.nodeType) {
    case ASTNodeType.Program:
      for (const child of node.children) {
        result = evaluate(child, indent + "\t");
      }
      break;
    case ASTNodeType.Additive:
      const child1 = node.children[0];
      let value1 = evaluate(child1, indent + "\t");

      const child2 = node.children[1];
      let value2 = evaluate(child2, indent + "\t");
      if (node.text === "+") {
        result = value1 + value2;
      } else {
        result = value1 - value2;
      }
      break;
    case ASTNodeType.Literal:
      result = Number(node.text);
      break;
  }
  console.log("Result:", result);
  return result;
}

class SimpleASTNode {
  parent = null;
  children: SimpleASTNode[] = [];
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
  Additive = "Additive",
}
