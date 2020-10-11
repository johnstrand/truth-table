import React, { useState } from "react";
import Table from "./Components/Table";
import Visualize from "./Components/Visualize";
import { evaluate } from "./Utils/Evaluation";
import { parse, Syntax } from "./Utils/Parser";
import { TruthTable } from "./Utils/Types";
import { createGenerator } from "./Utils/ValueSource";
import "./App.css";

function App() {
  const [code, setCode] = useState(() => {
    try {
      const preload = window.location.hash.substring(1);
      return preload ? window.atob(preload) : "";
    } catch (err) {
      // TODO: Error handling
      window.location.hash = "";
      return "";
    }
  });

  const [table, setTable] = useState<TruthTable>();
  const [tree, setTree] = useState<Syntax>();

  const parseExpression = () => {
    const { tree: _tree, identifiers } = parse(code);
    const values = createGenerator(identifiers);
    const _table: TruthTable = {
      columns: identifiers,
      variants: [],
    };

    while (!values.done()) {
      const items = values.next();
      const result = evaluate(_tree, items);
      _table.variants.push({
        values: items,
        result,
      });
    }

    // TODO: Error handling

    setTable(_table);
    setTree(_tree);
  };

  const updateCode = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      currentTarget: { value },
    } = e;
    window.location.hash = window.btoa(value);
    setCode(value);
  };

  return (
    <div>
      <div>
        <textarea
          cols={50}
          rows={10}
          onChange={updateCode}
          value={code}
        ></textarea>
      </div>
      <div>
        <button onClick={parseExpression} disabled={!code}>
          Evaluate
        </button>
      </div>
      <div>{table && <Table table={table} />}</div>
      <div>{tree && <Visualize syntax={tree} />}</div>
    </div>
  );
}

export default App;
