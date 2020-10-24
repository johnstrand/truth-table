import React from "react";
import { id } from "../Utils/Functions";
import { Result, TruthTable } from "../Utils/Types";
import Explain from "./Explain";

interface Props {
  table: TruthTable;
}

const Table = ({ table }: Props) => {
  const [explain, setExplain] = React.useState<Result>();

  React.useEffect(() => {
    setExplain(undefined);
  }, [table]);

  return (
    <table>
      <thead>
        <tr>
          {table.columns.map((h) => (
            <th key={h}>{h}</th>
          ))}
          <th>Result</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {table.variants.map((v, i) => (
          <tr key={id()}>
            {table.columns.map((h) => (
              <td key={id()}>{v.values[h]?.toString()}</td>
            ))}
            <td>{v.result.value.toString()}</td>
            <td>
              <button onClick={() => setExplain(v.result)}>?</button>
            </td>
            {i === 0 && (
              <td rowSpan={table.variants.length}>
                {explain && <Explain result={explain} />}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
