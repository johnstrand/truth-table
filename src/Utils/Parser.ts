import { createTokenStream } from "./Tokenizer";
import { Syntax, Token, IdentToken, BinaryTokenType } from "./Types";

export const parse = (code: string) => {
  // Set to track all known identifiers, set ensures that only unique values are tracked
  const identifiers = new Set<string>();

  // Create stream to extract tokens
  const tokens = createTokenStream(code);

  const binarySyntax = (
    next: () => Syntax,
    type: BinaryTokenType
  ) => (): Syntax => {
    // Fetch left operand (either an identifier or an operator with a higher precedence)
    const left = next();

    // Create a binary operation based on the left operand
    const binary = {
      sequence: left.sequence,
      type,
      expressions: [left],
    };

    // While there are still tokens to be read, and the next token is the same kind of
    // operator that we're trying to process
    while (!tokens.eof() && tokens.match(type)) {
      // Add the operation to the list of operations
      binary.expressions.push(next());
    }

    // If there's only 1 expression then we didn't actually find the operator we were
    // looking for, so just unwrap the lone expression
    return binary.expressions.length === 1 ? binary.expressions[0] : binary;
  };

  const ident = (): Syntax => {
    // Is the next token a parenthesis? Then we have a subexpression to parse
    if (tokens.match("LPAREN")) {
      // Start over at the top of the precedence order
      const expr = or();
      // Ensure that there's a closing parenthesis
      tokens.expect<Token>("RPAREN");
      return expr;
    }

    // Fetch the expected IdentToken and extract necessary information
    const { name, sequence } = tokens.expect<IdentToken>("IDENT");

    // Track the identifier
    identifiers.add(name);

    return {
      type: "IDENT",
      name,
      sequence,
    };
  };

  const not = (): Syntax => {
    // Is the next token an inversion?
    const notToken = tokens.match("NOT");
    if (notToken) {
      // Recursively read NOT expressions until we find an identifier (or a sub-expression)
      return {
        type: "NOT",
        expression: not(),
        sequence: notToken.sequence,
      };
    }

    // No inversion, just return an identifier
    return ident();
  };

  const eq = binarySyntax(not, "EQ");
  const and = binarySyntax(eq, "AND");
  const xor = binarySyntax(and, "XOR");
  const or = binarySyntax(xor, "OR");

  // Start at the top (or bottom, methods are called in ascending order of precedence OR > XOR > AND > NOT > PARENTHESIS > IDENTIFIER)
  const tree = or();

  // We're only dealing with a single expression at once, so we should find an EOF here,
  // but let's make sure
  tokens.expect<Token>("EOF");

  return {
    tree,
    identifiers: Array.from(identifiers),
  };
};
