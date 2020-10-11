import { Syntax } from "./Parser";

export const evaluate = (
  tree: Syntax,
  state: { [key: string]: boolean }
): boolean => {
  if (tree.type === "AND") {
    return evaluate(tree.left, state) && evaluate(tree.right, state);
  } else if (tree.type === "OR") {
    return evaluate(tree.left, state) || evaluate(tree.right, state);
  } else if (tree.type === "NOT") {
    return !evaluate(tree.expression, state);
  } else if (tree.type === "IDENT") {
    return state[tree.name];
  } else {
    throw new Error(`Unknown type ${tree.type}`);
  }
};
