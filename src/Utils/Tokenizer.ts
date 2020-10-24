import { TokenStream, Token, TokenType } from "./Types";

type CharStream = {
  next(): string;
  peek(): string;
  eof(): boolean;
  match(char: string): boolean;
};

const createCharStream = (text: string): CharStream => {
  let index = 0;
  return {
    next() {
      return this.eof() ? "" : text.charAt(index++);
    },
    peek() {
      return this.eof() ? "" : text.charAt(index);
    },
    eof() {
      return index >= text.length;
    },
    match(char: string) {
      if (char === this.peek()) {
        this.next();
        return true;
      }
      return false;
    },
  };
};

const isWhitespace = (text: string) => {
  return text.length === 0 || text.match(/\s/);
};

const operators = new Set(["|", "&", "(", ")", "!", "^"]);

const isIdent = (text: string) => {
  return text.length > 0 && !isWhitespace(text) && !operators.has(text);
};

export const createTokenStream = (code: string): TokenStream => {
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
      if (cache.length) {
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

      if (stream.match("(")) {
        return {
          type: "LPAREN",
          sequence: seq++,
        };
      } else if (stream.match(")")) {
        return {
          type: "RPAREN",
          sequence: seq++,
        };
      } else if (stream.match("&")) {
        stream.match("&"); // Permit &&
        return {
          type: "AND",
          sequence: seq++,
        };
      } else if (stream.match("|")) {
        stream.match("|"); // Permit ||
        return {
          type: "OR",
          sequence: seq++,
        };
      } else if (stream.match("!")) {
        return {
          type: "NOT",
          sequence: seq++,
        };
      } else if (stream.match("^")) {
        return {
          type: "XOR",
          sequence: seq++,
        };
      } else {
        const ident: string[] = [];
        while (isIdent(stream.peek())) {
          ident.push(stream.next());
        }
        return {
          type: "IDENT",
          name: ident.join(""),
          sequence: seq++,
        };
      }
    },
  };
};
