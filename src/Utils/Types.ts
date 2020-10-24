export type State = {
  [key: string]: boolean;
};

export type Result = {
  children: Result[];
  value: boolean;
  label: string;
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
  match(type: TokenType): boolean;
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

export type SyntaxKind = TokenType;

export interface Token {
  type: TokenType;
}

export interface IdentToken extends Token {
  name: string;
}

interface BinarySyntax {
  type: Extract<SyntaxKind, "AND" | "OR" | "XOR">;
  left: Syntax;
  right: Syntax;
}

interface IdentifierSyntax {
  type: Extract<SyntaxKind, "IDENT">;
  name: string;
}

interface UnarySyntax {
  type: Extract<SyntaxKind, "NOT">;
  expression: Syntax;
}

export type Syntax = BinarySyntax | IdentifierSyntax | UnarySyntax;
