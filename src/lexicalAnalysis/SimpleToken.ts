import { TokenType } from "./enum/TokenType";

export default class SimpleToken {
  private _type: TokenType;
  private _value: string;

  set type(value: TokenType) {
    this._type = value;
  }

  set value(value: string) {
    this._value = value;
  }

  getType() {
    return this._type;
  }

  getValue() {
    return this._value;
  }
}
