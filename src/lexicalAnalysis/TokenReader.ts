import SimpleToken from "./SimpleToken";

export default class TokenReader {
  private tokens: SimpleToken[];
  private pos = 0;

  constructor(tokens: SimpleToken[]) {
    this.tokens = tokens;
  }

  peek() {
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos];
    }
    return null;
  }

  read() {
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos++];
    }
    return null;
  }

  unread() {
    if (this.pos > 0) {
      this.pos--;
    }
  }

  getPosition() {
    return this.pos;
  }

  setPosition(position: number) {
    if (position >= 0 && position < this.tokens.length) {
      this.pos = position;
    }
  }
}
