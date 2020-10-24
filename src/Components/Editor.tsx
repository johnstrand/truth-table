import * as React from "react";

interface Props {
  onChange: (value: string) => void;
}

const Editor = (props: Props) => {
  const [code, setCode] = React.useState(() => {
    try {
      const preload = window.location.hash.substring(1);
      return preload ? window.atob(preload) : "";
    } catch (err) {
      // TODO: Error handling
      window.location.hash = "";
      return "";
    }
  });

  React.useEffect(() => {
    props.onChange(code);
  }, [props, code]);

  const updateCode = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      currentTarget: { value },
    } = e;
    window.location.hash = window.btoa(value);
    setCode(value);
  };
  return (
    <textarea cols={50} rows={10} onChange={updateCode} value={code}></textarea>
  );
};

export default Editor;
