export type State = {
  [key: string]: boolean;
};

export type Result = {
  children: Result[];
  value: boolean;
  label: string;
  sequence: number;
};

export type Variant = {
  values: State;
  result: Result;
};

export type TruthTable = {
  columns: string[];
  variants: Variant[];
};

export type TokenStream = {
  next(): Token;
  eof(): boolean;
  match(type: TokenType): Token | undefined;
  expect<T extends Token>(type: T["type"]): T;
};

export type TokenType =
  | "AND"
  | "OR"
  | "XOR"
  | "LPAREN"
  | "RPAREN"
  | "NOT"
  | "IDENT"
  | "EOF";

export type BinaryTokenType = Extract<TokenType, "AND" | "OR" | "XOR">;

export type SyntaxKind = TokenType;

export interface Token {
  type: TokenType;
  sequence: number;
}

export interface IdentToken extends Token {
  name: string;
}

interface BinarySyntax {
  sequence: number;
  type: Extract<SyntaxKind, "AND" | "OR" | "XOR">;
  expressions: Syntax[];
}

interface IdentifierSyntax {
  sequence: number;
  type: Extract<SyntaxKind, "IDENT">;
  name: string;
}

interface UnarySyntax {
  sequence: number;
  type: Extract<SyntaxKind, "NOT">;
  expression: Syntax;
}

export type Syntax = BinarySyntax | IdentifierSyntax | UnarySyntax;
