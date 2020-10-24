import React from "react";

export const useDebouncedState = <T>(
  initialValue: T | (() => T),
  timeout: number
) => {
  const handle = React.useRef(-1);
  const [state, setState] = React.useState(initialValue);

  const debouncer: typeof setState = (state) => {
    if (handle.current > -1) {
      window.clearTimeout(handle.current);
    }
    handle.current = window.setTimeout(() => setState(state), timeout);
  };

  return [state, debouncer] as const;
};
