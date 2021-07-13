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
          evaluate(child, "");
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

/**
 * A -> M | M + A
 *
 * @param tokens
 * @returns
 */
function additive(tokens: TokenNode[]): SimpleASTNode {
  let child1 = multiplicative(tokens);
  let node: SimpleASTNode = child1;
  let token = tokens[0];
  if (child1 !== null && token !== undefined) {
    if (token.type === TokenType.Push) {
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

/**
 * M -> num | num * M
 * @param tokens
 */
function multiplicative(tokens: TokenNode[]) {
  let token = tokens[0];
  let node: SimpleASTNode = null;
  if (token !== undefined && token.type === TokenType.IntLiteral) {
    let child1 = new SimpleASTNode(ASTNodeType.Literal, token.value);
    node = child1;
    tokens.shift();
    token = tokens[0];
    if (token !== undefined && token.type === TokenType.Star) {
      tokens.shift();
      const child2 = multiplicative(tokens);
      if (child2 !== null) {
        node = new SimpleASTNode(ASTNodeType.Multiplicative, token.value);
        node.addChild(child1);
        node.addChild(child2);
      }
    }
  }
  return node;
}

export function evaluate(node: SimpleASTNode, indent: string) {
  let result = 0;
  let child1: SimpleASTNode = null;
  let child2: SimpleASTNode = null;
  let value1: number = 0;
  let value2: number = 0;
  console.log(indent + "Calculating: " + node.nodeType);
  switch (node.nodeType) {
    case ASTNodeType.Program:
      for (const child of node.children) {
        result = evaluate(child, indent + "\t");
      }
      break;
    case ASTNodeType.Additive:
      child1 = node.children[0];
      value1 = evaluate(child1, indent + "\t");

      child2 = node.children[1];
      value2 = evaluate(child2, indent + "\t");
      if (node.text === "+") {
        result = value1 + value2;
      } else {
        result = value1 - value2;
      }
      break;
    case ASTNodeType.Multiplicative:
      child1 = node.children[0];
      value1 = evaluate(child1, indent + "\t");

      child2 = node.children[1];
      value2 = evaluate(child2, indent + "\t");
      if (node.text === "*") {
        result = value1 * value2;
      } else {
        result = value1 / value2;
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
  Multiplicative = "Multiplicative",
}
