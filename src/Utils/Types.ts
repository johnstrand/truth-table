export type TruthTable = {
  columns: string[];
  variants: {
    values: { [key: string]: boolean };
    result: boolean;
  }[];
};
