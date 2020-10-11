import React from "react";
import { Syntax } from "../Utils/Parser";

interface Props {
  syntax: Syntax;
}

const Operator = (props: { type: string; children: React.ReactNode }) => {
  return (
    <div className="visualize-root">
      <div className="visualize-title">{props.type}</div>
      <div className="visualize-children">{props.children}</div>
    </div>
  );
};

const Visualize = ({ syntax }: Props) => {
  if (syntax.type === "AND") {
    return (
      <Operator type="And">
        <Visualize syntax={syntax.left} />
        <Visualize syntax={syntax.right} />
      </Operator>
    );
  } else if (syntax.type === "OR") {
    return (
      <Operator type="Or">
        <Visualize syntax={syntax.left} />
        <Visualize syntax={syntax.right} />
      </Operator>
    );
  } else if (syntax.type === "NOT") {
    return (
      <Operator type="Not">
        <Visualize syntax={syntax.expression} />
      </Operator>
    );
  } else if (syntax.type === "IDENT") {
    return <div>{syntax.name}</div>;
  } else {
    throw new Error(`Unknown type ${syntax.type}`);
  }
};

export default Visualize;
