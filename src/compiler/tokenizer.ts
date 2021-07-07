import { Literal, Node } from "../type";

enum DfaState {
  Initial,
  Id,
  IntLiteral,
  GT,
  GE,
}

enum TokenType {
  Identifier,
  IntLiteral,
  GT,
  GE,
}

class Token {
  type: TokenType = null;
  value = null;
}

const isAlpha = (char: string) => {
  return /[a-zA-Z]/.test(char);
};

const isDigit = (char: string) => {
  return /[0-9]/.test(char);
};

/**
 * 词法分析函数
 * 将源代码的字符串转换成token数组
 * 使用有穷状态机方法
 *
 * @param code 代码
 * @returns
 */
export default function tokenizer(code: string): Node[] {
  let current = 0;
  const tokens = [];

  let value = "";
  let char = "";
  let state: DfaState = DfaState.Initial;

  let token = new Token();

  const initToken = (char: string) => {
    if (value.length > 0) {
      token.value = value;
      tokens.push(token);

      value = "";
      token = new Token();
    }

    let newState = DfaState.Initial;
    if (isAlpha(char)) {
      newState = DfaState.Id;
      token.type = TokenType.Identifier;
      value += char;
    } else if (isDigit(char)) {
      newState = DfaState.IntLiteral;
      token.type = TokenType.IntLiteral;
      value += char;
    } else if (char === ">") {
      newState = DfaState.GT;
      token.type = TokenType.GT;
      value += char;
    }

    return newState;
  };

  while (current < code.length) {
    char = code[current];
    ++current;

    switch (state) {
      case DfaState.Initial:
        state = initToken(char);
        break;
      case DfaState.Id:
        if (isAlpha(char) || isDigit(char)) {
          value += char;
        } else {
          state = initToken(char);
        }
        break;
      case DfaState.IntLiteral:
        if (isDigit(char)) {
          value += char;
        } else {
          state = initToken(char);
        }
        break;
      case DfaState.GT:
        if (char === "=") {
          token.type = TokenType.GE;
          state = DfaState.GE;
          value += char;
        } else {
          state = initToken(char);
        }
        break;
      case DfaState.GE:
        state = initToken(char);
        break;
      default:
        throw new TypeError("I don‘t know what this character is: " + char);
    }
  }

  if (value.length > 0) {
    initToken(char);
  }

  return tokens;
}
