import React from "react";
import { id } from "../Utils/Functions";
import { TruthTable } from "../Utils/Types";

interface Props {
  table: TruthTable;
}

const Table = ({ table }: Props) => {
  return (
    <table>
      <thead>
        <tr>
          {table.columns.map((h) => (
            <th key={h}>{h}</th>
          ))}
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        {table.variants.map((v, i) => (
          <tr key={id()}>
            {table.columns.map((h) => (
              <td key={id()}>{v.values[h]?.toString()}</td>
            ))}
            <td>{v.result.toString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
