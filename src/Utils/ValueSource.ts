export const createGenerator = (identifiers: string[]) => {
  const bits = identifiers.length;
  const variants = Math.pow(2, bits);
  let variant = 0;
  return {
    done() {
      return variant >= variants;
    },
    next() {
      const _variant = variant++;
      const values: { [key: string]: boolean } = {};
      for (let bit = 1, index = 0; bit < variants; bit *= 2, index++) {
        const name = identifiers[index];
        const value = (_variant & bit) > 0;
        values[name] = !value;
      }
      return values;
    },
  };
};
