import { State, Result, Syntax, BinaryOperationReducer } from "./Types";

const binaryOperation = (
  label: string,
  expressions: Syntax[],
  state: State,
  operation: (a: boolean, b: boolean) => boolean,
  sequence: number
) => {
  // Evaluate each sub-expression first
  const evaluated = expressions.map((expr) => evaluate(expr, state));
  return {
    label,
    children: evaluated,
    // The final value is the result of all the sub-expressions ran through a reducer
    value: evaluated.map((e) => e.value).reduce(operation),
    sequence,
  };
};

// Reducers for the binary operations
const binaryOperationReducers: BinaryOperationReducer = {
  AND: (a, b) => a && b, // All values true
  OR: (a, b) => a || b, // At least one value true
  XOR: (a, b) => a !== b, // No values equal
};

export const evaluate = (tree: Syntax, state: State): Result => {
  // Is the type any kind of binary operation?
  if (tree.type === "AND" || tree.type === "OR" || tree.type === "XOR") {
    return binaryOperation(
      tree.type,
      tree.expressions,
      state,
      binaryOperationReducers[tree.type],
      tree.sequence
    );
    // Is the operation unary NOT
  } else if (tree.type === "NOT") {
    const result = evaluate(tree.expression, state);
    return {
      label: "NOT",
      value: !result.value, // Invert the result
      children: [result],
      sequence: tree.sequence,
    };
    // Is the expression an identifier
  } else if (tree.type === "IDENT") {
    return {
      label: `${tree.name} = ${state[tree.name]}`,
      value: state[tree.name], // Extract the value from the current state
      children: [],
      sequence: tree.sequence,
    };
  } else {
    throw new Error(`Unknown type ${tree.type}`);
  }
};
