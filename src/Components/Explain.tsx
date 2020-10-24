import React from "react";
import { Result } from "../Utils/Types";

interface Props {
  result: Result;
}

const Explain = ({ result }: Props) => {
  return (
    <ul>
      <li className="explain-tree">
        {result.label} {result.children.length > 0 && `(${result.value})`}
        {result.children.length > 0 &&
          result.children.map((c) => (
            <Explain key={Math.random()} result={c} />
          ))}
      </li>
    </ul>
  );
};

export default Explain;
