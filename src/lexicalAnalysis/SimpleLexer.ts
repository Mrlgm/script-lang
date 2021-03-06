import { DfaState } from "./enum/DfaState";
import { TokenType } from "./enum/TokenType";
import SimpleToken from "./SimpleToken";
import TokenReader from "./TokenReader";

const isAlpha = (char: string) => {
  return /[a-zA-Z]/.test(char);
};

const isDigit = (char: string) => {
  return /[0-9]/.test(char);
};

const isBlank = (char: string) => {
  return /\s/.test(char);
};

export default class SimpleLexer {
  //   public code: string;
  /** 临时保存的token文本 */
  private tokenText: string = "";
  /** 当前正在读取的token */
  private token: SimpleToken = new SimpleToken();
  /** 当前token列表 */
  private tokens: SimpleToken[] = [];

  //   constructor(code: string) {
  //     this.code = code;
  //   }

  initToken(char: string) {
    if (this.tokenText.length > 0) {
      this.token.value = this.tokenText;
      this.tokens.push(this.token);

      this.tokenText = "";
      this.token = new SimpleToken();
    }

    let newState = DfaState.Initial;
    if (isAlpha(char)) {
      if (char === "i") {
        newState = DfaState.Id_int1;
      } else {
        newState = DfaState.Identifier;
      }
      this.token.type = TokenType.Identifier;
      this.tokenText += char;
    } else if (isDigit(char)) {
      this.token.type = TokenType.IntLiteral;
      newState = DfaState.IntLiteral;
      this.tokenText += char;
    } else if (char === ">") {
      this.token.type = TokenType.GT;
      newState = DfaState.GT;
      this.tokenText += char;
    } else if (char === "=") {
      this.token.type = TokenType.Assignment;
      newState = DfaState.Assignment;
      this.tokenText += char;
    } else if (char === "+") {
      this.token.type = TokenType.Push;
      newState = DfaState.Push;
      this.tokenText += char;
    } else if (char === "-") {
      this.token.type = TokenType.Minus;
      newState = DfaState.Minus;
      this.tokenText += char;
    } else if (char === "*") {
      this.token.type = TokenType.Star;
      newState = DfaState.Star;
      this.tokenText += char;
    } else if (char === "/") {
      this.token.type = TokenType.Slash;
      newState = DfaState.Slash;
      this.tokenText += char;
    } else if (char === ";") {
      this.token.type = TokenType.SemiColon;
      newState = DfaState.SemiColon;
      this.tokenText += char;
    } else if (char === "(") {
      this.token.type = TokenType.LeftParen;
      newState = DfaState.LeftParen;
      this.tokenText += char;
    } else if (char === ")") {
      this.token.type = TokenType.RightParen;
      newState = DfaState.RightParen;
      this.tokenText += char;
    }

    return newState;
  }

  tokenizer(code: string) {
    let current = 0;
    let char = "";
    let state = DfaState.Initial;

    while (current < code.length) {
      char = code[current];
      current++;
      switch (state) {
        case DfaState.Initial:
          state = this.initToken(char);
          break;
        case DfaState.Identifier:
          if (isAlpha(char) || isDigit(char)) {
            this.tokenText += char;
          } else {
            state = this.initToken(char);
          }
          break;
        case DfaState.Id_int1:
          if (char === "n") {
            state = DfaState.Id_int2;
            this.tokenText += char;
          } else if (isAlpha(char) || isDigit(char)) {
            state = DfaState.Identifier;
            this.tokenText += char;
          } else {
            state = this.initToken(char);
          }
          break;
        case DfaState.Id_int2:
          if (char === "t") {
            state = DfaState.Id_int3;
            this.tokenText += char;
          } else if (isAlpha(char) || isDigit(char)) {
            state = DfaState.Identifier;
            this.tokenText += char;
          } else {
            state = this.initToken(char);
          }
          break;
        case DfaState.Id_int3:
          if (isBlank(char)) {
            this.token.type = TokenType.Int;
            state = this.initToken(char);
          } else {
            state = DfaState.Identifier;
            this.tokenText += char;
          }
          break;
        case DfaState.IntLiteral:
          if (isDigit(char)) {
            this.tokenText += char;
          } else {
            state = this.initToken(char);
          }
          break;

        case DfaState.GT:
          if (char === "=") {
            state = DfaState.GE;
            this.token.type = TokenType.GE;
            this.tokenText += char;
          } else {
            state = this.initToken(char);
          }
          break;
        case DfaState.GE:
        case DfaState.Assignment:
        case DfaState.Push:
        case DfaState.Minus:
        case DfaState.Star:
        case DfaState.Slash:
        case DfaState.SemiColon:
        case DfaState.RightParen:
        case DfaState.LeftParen:
          state = this.initToken(char);
          break;
      }
    }

    this.initToken(char);
    return new TokenReader(this.tokens);
  }
}
