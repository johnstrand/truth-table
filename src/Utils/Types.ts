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
  | "EQ"
  | "LPAREN"
  | "RPAREN"
  | "NOT"
  | "IDENT"
  | "EOF";

export type BinaryTokenType = Extract<TokenType, "AND" | "OR" | "XOR" | "EQ">;

export type SingleTokenType<T extends TokenType> = Extract<TokenType, T>;

export type BinaryOperationReducer = {
  [T in BinaryTokenType]: (acc: boolean, cur: boolean) => boolean;
};

export interface Token {
  type: TokenType;
  sequence: number;
  stringify(): string;
}

export interface IdentToken extends Token {
  name: string;
}

interface BinarySyntax {
  sequence: number;
  type: BinaryTokenType;
  expressions: Syntax[];
}

interface IdentifierSyntax {
  sequence: number;
  type: SingleTokenType<"IDENT">;
  name: string;
}

interface UnarySyntax {
  sequence: number;
  type: SingleTokenType<"NOT">;
  expression: Syntax;
}

export type Syntax = BinarySyntax | IdentifierSyntax | UnarySyntax;
