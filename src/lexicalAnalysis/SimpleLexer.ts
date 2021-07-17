import { DfaState } from "./enum/DfaState";
import { TokenType } from "./enum/TokenType";
import SimpleToken from "./SimpleToken";

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
      this.token.type = TokenType.Identifier;
      newState = DfaState.Identifier;
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
    } else if (char === "*") {
      this.token.type = TokenType.Star;
      newState = DfaState.Star;
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
          if (isAlpha(char)) {
            this.tokenText += char;
          } else {
            state = this.initToken(char);
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
          state = this.initToken(char);
          break;
        case DfaState.Assignment:
          state = this.initToken(char);
          break;
        case DfaState.Push:
          state = this.initToken(char);
          break;
        case DfaState.Star:
          state = this.initToken(char);
          break;
      }
    }

    this.initToken(char);
    return this.tokens;
  }
}
