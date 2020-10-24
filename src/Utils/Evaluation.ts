import { State, Result, Syntax } from "./Types";

const binaryOperation = (
  label: string,
  left: Syntax,
  right: Syntax,
  state: State,
  operation: (a: boolean, b: boolean) => boolean,
  sequence: number
) => {
  const _left = evaluate(left, state);
  const _right = evaluate(right, state);

  return {
    label,
    children: [_left, _right],
    value: operation(_left.value, _right.value),
    sequence,
  };
};

export const evaluate = (tree: Syntax, state: State): Result => {
  if (tree.type === "AND") {
    return binaryOperation(
      "AND",
      tree.left,
      tree.right,
      state,
      (a, b) => a && b,
      tree.sequence
    );
  } else if (tree.type === "OR") {
    return binaryOperation(
      "OR",
      tree.left,
      tree.right,
      state,
      (a, b) => a || b,
      tree.sequence
    );
  } else if (tree.type === "XOR") {
    return binaryOperation(
      "XOR",
      tree.left,
      tree.right,
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
