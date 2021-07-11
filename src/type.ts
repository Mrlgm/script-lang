/** 节点 */
export interface Node {
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

export interface Program extends Node {
  type: "Program";
  body: Statement[];
}

export interface Identifier extends Node, Expression, Pattern {
  type: "Identifier";
  name: string;
}

export interface Literal extends Node, Expression {
  type: "Literal";
  value: string | boolean | null | number | RegExp;
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

export interface BinaryExpression extends Expression {
  type: "BinaryExpression";
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
}

export interface VariableDeclaration extends Declaration {
  type: "VariableDeclaration";
  declarations: [VariableDeclarator];
  kind: "var" | "let" | "const";
}

export interface VariableDeclarator extends Node {
  type: "VariableDeclarator";
  id: Pattern;
  init: Expression | null;
}
