import { TokenStream, Token, TokenType } from "./Types";

type CharStream = {
  previous(): string;
  next(): string;
  peek(): string;
  eof(): boolean;
  match(...char: string[]): boolean;
};

const createCharStream = (text: string): CharStream => {
  let index = 0;
  return {
    previous() {
      return text.charAt(index - 1);
    },
    next() {
      return this.eof() ? "" : text.charAt(index++);
    },
    peek() {
      return this.eof() ? "" : text.charAt(index);
    },
    eof() {
      return index >= text.length;
    },
    match(...char: string[]) {
      const next = this.peek();
      if (char.some((c) => c === next)) {
        this.next();
        return true;
      }
      return false;
    },
  };
};

const operators = new Map<string, TokenType>([
  ["|", "OR"],
  ["&", "AND"],
  ["(", "LPAREN"],
  [")", "RPAREN"],
  ["!", "NOT"],
  ["^", "XOR"],
]);

const operatorKeys = Array.from(operators.keys());

export const createTokenStream = (code: string): TokenStream => {
  const isWhitespace = (text: string) => {
    return text.length === 0 || text.match(/\s/);
  };

  const isIdent = (text: string) => {
    return text.length > 0 && !isWhitespace(text) && !operators.has(text);
  };

  const stream = createCharStream(code);
  const cache: Token[] = [];
  let seq = 1;
  return {
    eof() {
      return stream.eof() && cache.length === 0;
    },
    match(type: TokenType) {
      const token = this.next();
      const isMatch = token.type === type;
      if (!isMatch) {
        cache.push(token);
        return;
      }
      return token;
    },
    expect<T extends Token>(type: T["type"]): T {
      const token = this.next();
      if (token.type !== type) {
        throw new Error(`Expected ${type}, found ${token.type}`);
      }
      return token as T;
    },
    next() {
      if (cache.length > 0) {
        return cache.shift() as Token;
      }

      while (isWhitespace(stream.peek()) && !stream.eof()) {
        stream.next();
      }

      if (this.eof()) {
        return {
          type: "EOF",
          sequence: seq++,
        };
      }

      if (stream.match(...operatorKeys)) {
        const operator = stream.previous();
        if (operator === "|" || operator === "&") {
          stream.match(operator);
        }
        return {
          type: operators.get(operator) as TokenType,
          sequence: seq++,
        };
      }

      const ident: string[] = [];
      while (isIdent(stream.peek())) {
        ident.push(stream.next());
      }
      return {
        type: "IDENT",
        name: ident.join(""),
        sequence: seq++,
      };
    },
  };
};
