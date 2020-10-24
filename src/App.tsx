import React, { useEffect, useState } from "react";
import Table from "./Components/Table";
import { evaluate } from "./Utils/Evaluation";
import { parse } from "./Utils/Parser";
import { TruthTable } from "./Utils/Types";
import { createGenerator } from "./Utils/ValueSource";
import "./App.css";
import { useDebouncedState } from "./Utils/Hooks";
import Editor from "./Components/Editor";

function App() {
  const [table, setTable] = useState<TruthTable>();
  const [error, setError] = useState("");

  const [code, setCode] = useDebouncedState("", 500);

  const parseExpression = () => {
    if (!code) {
      return;
    }
    setError("");
    try {
      const { tree, identifiers } = parse(code);
      const values = createGenerator(identifiers);
      const _table: TruthTable = {
        columns: identifiers,
        variants: [],
      };
      while (!values.done()) {
        const items = values.next();
        const result = evaluate(tree, items);
        _table.variants.push({
          values: items,
          result,
        });
      }

      setTable(_table);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(parseExpression, [code]);

  return (
    <div>
      <div>
        <span>Operators (in order of precedence):</span>
        <ul className="operator-list">
          <li>NOT: !</li>
          <li>AND: & (&& is also permitted)</li>
          <li>XOR: ^</li>
          <li>OR: | (|| is also permitted)</li>
        </ul>
        <span>
          Statements may be grouped with ( ). Anything that isn't an operator,
          parenthesis, or whitespace will be treated as a variable
        </span>
      </div>
      <div></div>
      <div>
        <div>
          <Editor onChange={setCode} />
        </div>
        {error && <span className="error">{error}</span>}
      </div>
      <div>{table && <Table table={table} />}</div>
    </div>
  );
}

export default App;
