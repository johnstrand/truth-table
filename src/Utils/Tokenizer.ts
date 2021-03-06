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
  ["=", "EQ"],
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
        // TODO: Improve errror message
        throw new Error(`Expected ${type}, found ${token.stringify()}`);
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
          stringify() {
            return "End of Statement";
          },
        };
      }

      if (stream.match(...operatorKeys)) {
        const operator = stream.previous();
        if (operator === "|" || operator === "&" || operator === "=") {
          // Handle ||, &&, and ==
          stream.match(operator);
          if (operator === "=") {
            // Also handle ===
            stream.match(operator);
          }
        }
        return {
          type: operators.get(operator) as TokenType,
          sequence: seq++,
          stringify() {
            // TODO: Improve error reporting
            return this.type;
          },
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
        stringify() {
          return `identifier ${ident.join("")}`;
        },
      };
    },
  };
};
