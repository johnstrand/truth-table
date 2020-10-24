import { State } from "./Types";

export const createGenerator = (identifiers: string[]) => {
  // Number of values in each set
  const segments = identifiers.length;
  // 1 << n is the same as 2 ^ n
  const variants = 1 << segments;
  let variant = 0;
  return {
    done() {
      return variant >= variants;
    },
    next() {
      const values: State = {};
      for (let index = 0; index < segments; index++) {
        const name = identifiers[index];
        // Right-shift the current variant by the current index
        // and see if the 1-bit is set. Let's consider this to
        // be false. See below for more details
        const value = (variant >> index) & 1;
        values[name] = !value;
      }
      variant++;
      return values;
    },
  };
};

/*
These listings cover each case for the set [a, b, c]
{
  variant: 0,
  a: '0 >> 0 = 0, and 0 & 1 = 0. And finally inverted: 0',
  b: '0 >> 1 = 0, and 0 & 1 = 0. And finally inverted: 0',
  c: '0 >> 2 = 0, and 0 & 1 = 0. And finally inverted: 0'
}
{
  variant: 1,
  a: '1 >> 0 = 1, and 1 & 1 = 1. And finally inverted: 1',
  b: '1 >> 1 = 0, and 0 & 1 = 0. And finally inverted: 0',
  c: '1 >> 2 = 0, and 0 & 1 = 0. And finally inverted: 0'
}
{
  variant: 2,
  a: '2 >> 0 = 2, and 2 & 1 = 0. And finally inverted: 0',
  b: '2 >> 1 = 1, and 1 & 1 = 1. And finally inverted: 1',
  c: '2 >> 2 = 0, and 0 & 1 = 0. And finally inverted: 0'
}
{
  variant: 3,
  a: '3 >> 0 = 3, and 3 & 1 = 1. And finally inverted: 1',
  b: '3 >> 1 = 1, and 1 & 1 = 1. And finally inverted: 1',
  c: '3 >> 2 = 0, and 0 & 1 = 0. And finally inverted: 0'
}
{
  variant: 4,
  a: '4 >> 0 = 4, and 4 & 1 = 0. And finally inverted: 0',
  b: '4 >> 1 = 2, and 2 & 1 = 0. And finally inverted: 0',
  c: '4 >> 2 = 1, and 1 & 1 = 1. And finally inverted: 1'
}
{
  variant: 5,
  a: '5 >> 0 = 5, and 5 & 1 = 1. And finally inverted: 1',
  b: '5 >> 1 = 2, and 2 & 1 = 0. And finally inverted: 0',
  c: '5 >> 2 = 1, and 1 & 1 = 1. And finally inverted: 1'
}
{
  variant: 6,
  a: '6 >> 0 = 6, and 6 & 1 = 0. And finally inverted: 0',
  b: '6 >> 1 = 3, and 3 & 1 = 1. And finally inverted: 1',
  c: '6 >> 2 = 1, and 1 & 1 = 1. And finally inverted: 1'
}
{
  variant: 7,
  a: '7 >> 0 = 7, and 7 & 1 = 1. And finally inverted: 1',
  b: '7 >> 1 = 3, and 3 & 1 = 1. And finally inverted: 1',
  c: '7 >> 2 = 1, and 1 & 1 = 1. And finally inverted: 1'
}
*/
