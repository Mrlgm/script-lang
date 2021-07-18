import { ASTNodeType } from "./enum/ASTNodeType";

export class SimpleASTNode {
  parent: SimpleASTNode = null;
  children: SimpleASTNode[] = [];
  nodeType: ASTNodeType = ASTNodeType.Program;
  text: string = null;

  constructor(nodeType: ASTNodeType, text: string) {
    this.nodeType = nodeType;
    this.text = text;
  }

  addChild(node: SimpleASTNode) {
    this.children.push(node);
  }
}

/** 节点 */
interface Node {
  type: string;
}
/** 语句 */
export interface Statement extends Node {}
/** 模式 */
export interface Pattern extends Node {}
/** 表达式 */
export interface Expression extends Node, Pattern {}
/** 声明 */
export interface Declaration extends Statement {}

export class Program implements Node {
  type: "Program";
}

export class Identifier implements Node, Expression, Pattern {
  type: "Identifier";
  name: string;
}

export class Literal implements Node, Expression {
  type: "Literal";
  value: string | boolean | null | number | RegExp;
}

export class VariableDeclaration implements Declaration {
  type: "VariableDeclaration";
  declarations: [VariableDeclarator];
  kind: "var" | "let" | "const";
}

export class VariableDeclarator implements Node {
  type: "VariableDeclarator";
  id: Pattern;
  init: Expression | null;
}

export type BinaryOperator =
  | "=="
  | "!="
  | "==="
  | "!=="
  | "<"
  | "<="
  | ">"
  | ">="
  | "<<"
  | ">>"
  | ">>>"
  | "+"
  | "-"
  | "*"
  | "/"
  | "%"
  | "|"
  | "^"
  | "in"
  | "instanceof"
  | "..";

export class BinaryExpression implements Expression {
  type: "BinaryExpression";
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
}
