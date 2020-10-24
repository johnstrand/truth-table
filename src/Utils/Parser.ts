import { createTokenStream } from "./Tokenizer";
import { Syntax, Token, IdentToken } from "./Types";

export const parse = (code: string) => {
  const identifiers = new Set<string>();
  const tokens = createTokenStream(code);

  const or = (): Syntax => {
    let left = xor();
    while (!tokens.eof() && tokens.match("OR")) {
      left = {
        type: "OR",
        left,
        right: xor(),
      };
    }

    return left;
  };

  const xor = (): Syntax => {
    let left = and();
    while (!tokens.eof() && tokens.match("XOR")) {
      left = {
        type: "XOR",
        left,
        right: and(),
      };
    }

    return left;
  };

  const and = (): Syntax => {
    let left = not();
    while (!tokens.eof() && tokens.match("AND")) {
      left = {
        type: "AND",
        left,
        right: not(),
      };
    }

    return left;
  };

  const not = (): Syntax => {
    if (tokens.match("NOT")) {
      return {
        type: "NOT",
        expression: not(),
      };
    }

    return ident();
  };

  const ident = (): Syntax => {
    if (tokens.match("LPAREN")) {
      const expr = or();
      tokens.expect<Token>("RPAREN");
      return expr;
    }

    const { name } = tokens.expect<IdentToken>("IDENT");

    identifiers.add(name);

    return {
      type: "IDENT",
      name,
    };
  };

  const tree = or();

  tokens.expect<Token>("EOF");

  return {
    tree,
    identifiers: Array.from(identifiers),
  };
};
