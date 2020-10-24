import { State, Result, Syntax } from "./Types";

const binaryOperation = (
  label: string,
  expressions: Syntax[],
  state: State,
  operation: (a: boolean, b: boolean) => boolean,
  sequence: number
) => {
  const evaluated = expressions.map((expr) => evaluate(expr, state));

  return {
    label,
    children: evaluated,
    value: evaluated.map((e) => e.value).reduce(operation),
    sequence,
  };
};

export const evaluate = (tree: Syntax, state: State): Result => {
  if (tree.type === "AND") {
    return binaryOperation(
      "AND",

      tree.expressions,
      state,
      (a, b) => a && b,
      tree.sequence
    );
  } else if (tree.type === "OR") {
    return binaryOperation(
      "OR",
      tree.expressions,
      state,
      (a, b) => a || b,
      tree.sequence
    );
  } else if (tree.type === "XOR") {
    return binaryOperation(
      "XOR",
      tree.expressions,
      state,
      (a, b) => a !== b,
      tree.sequence
    );
  } else if (tree.type === "NOT") {
    const result = evaluate(tree.expression, state);
    return {
      label: "NOT",
      value: !result.value,
      children: [result],
      sequence: tree.sequence,
    };
  } else if (tree.type === "IDENT") {
    return {
      label: `${tree.name} = ${state[tree.name]}`,
      value: state[tree.name],
      children: [],
      sequence: tree.sequence,
    };
  } else {
    throw new Error(`Unknown type ${tree.type}`);
  }
};
