import { Literal, Node } from "../type";

enum DfaState {
  Initial,
  Id,
  IntLiteral,
  GT,
  GE,
}

enum TokenType {
  Initial,
  Identifier,
  IntLiteral,
  GT,
  GE,
}

const isAlpha = (char: string) => {
  return /[a-zA-Z]/.test(char);
};

const isDigit = (char: string) => {
  return /[0-9]/.test(char);
};

class Token {
  type: TokenType = TokenType.Initial;
  value: string = "";

  get curToken() {
    return { type: this.type, value: this.value };
  }

  setTokenType(type: TokenType) {
    this.type = type;
  }

  add(char: string) {
    this.value += char;
  }

  initToken = (char: string) => {
    this.type = TokenType.Initial;
    this.value = "";

    if (isAlpha(char)) {
      this.type = TokenType.Identifier;
      this.add(char);
    } else if (isDigit(char)) {
      this.type = TokenType.IntLiteral;
      this.add(char);
    } else if (char === ">") {
      this.type = TokenType.GT;
      this.add(char);
    }
  };
}

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

  let char = "";

  let token = new Token();

  while (current < code.length) {
    char = code[current];
    ++current;

    switch (token.type) {
      case TokenType.Initial:
        token.initToken(char);
        break;
      case TokenType.Identifier:
        if (isAlpha(char) || isDigit(char)) {
          token.add(char);
        } else {
          tokens.push(token.curToken);
          token.initToken(char);
        }
        break;
      case TokenType.IntLiteral:
        if (isDigit(char)) {
          token.add(char);
        } else {
          tokens.push(token.curToken);
          token.initToken(char);
        }
        break;
      case TokenType.GT:
        if (char === "=") {
          token.setTokenType(TokenType.GE);
          token.add(char);
        } else {
          tokens.push(token.curToken);
          token.initToken(char);
        }
        break;
      case TokenType.GE:
        tokens.push(token.curToken);
        token.initToken(char);
        break;
      default:
        throw new TypeError("I don‘t know what this character is: " + char);
    }
  }

  if (token.value.length > 0) {
    tokens.push(token.curToken);
  }

  return tokens;
}
