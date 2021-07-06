import { Literal, Node } from "../type";

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

  while (current < code.length) {
    let char = code[current];

    const WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    // 解析数字类型
    const NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = "";
      while (NUMBERS.test(char)) {
        value += char;
        char = code[++current];
      }
      tokens.push({ type: "number", value });

      continue;
    }

    // 解析string类型
    if (char === '"') {
      let value = "";
      char = code[++current];

      while (char !== '"') {
        value += char;
        char = code[++current];
      }
      char = code[++current];

      tokens.push({ type: "string", value });
      continue;
    }

    const LETTERS = /[a-zA-Z]/i;
    if (LETTERS.test(char)) {
      let value = "";

      const UPDATE_LETTERS = /[a-zA-Z0-9]/;
      while (UPDATE_LETTERS.test(char)) {
        value += char;
        char = code[++current];
      }

      tokens.push({ type: "name", value });

      continue;
    }

    const PUNCTUATOR =
      /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
    if (PUNCTUATOR.test(char)) {
      let value = "";
      while (PUNCTUATOR.test(char)) {
        value += char;
        char = code[++current];
      }

      tokens.push({
        type: "symbol",
        value,
      });

      continue;
    }

    throw new TypeError("I dont know what this character is: " + char);
  }

  return tokens;
}
