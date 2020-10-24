import { createTokenStream } from "./Tokenizer";
import { Syntax, Token, IdentToken, BinaryTokenType } from "./Types";

export const parse = (code: string) => {
  const identifiers = new Set<string>();
  const tokens = createTokenStream(code);

  const binarySyntax = (
    next: () => Syntax,
    type: BinaryTokenType
  ) => (): Syntax => {
    let left = next();
    let t: Token | undefined;

    while (!tokens.eof() && (t = tokens.match(type))) {
      left = {
        sequence: t.sequence,
        type,
        left,
        right: next(),
      };
    }

    return left;
  };

  const ident = (): Syntax => {
    if (tokens.match("LPAREN")) {
      const expr = or();
      tokens.expect<Token>("RPAREN");
      return expr;
    }

    const { name, sequence } = tokens.expect<IdentToken>("IDENT");

    identifiers.add(name);

    return {
      type: "IDENT",
      name,
      sequence,
    };
  };

  const not = (): Syntax => {
    const t = tokens.match("NOT");
    if (t) {
      return {
        type: "NOT",
        expression: not(),
        sequence: t.sequence,
      };
    }

    return ident();
  };

  const and = binarySyntax(not, "AND");
  const xor = binarySyntax(and, "XOR");
  const or = binarySyntax(xor, "OR");

  const tree = or();

  tokens.expect<Token>("EOF");

  return {
    tree,
    identifiers: Array.from(identifiers),
  };
};
