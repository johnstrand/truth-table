import React from "react";

// Simple hook to debounce state updates
export const useDebouncedState = <T>(
  initialValue: T | (() => T),
  timeout: number
) => {
  // Timeout handle, initially set to -1
  const handle = React.useRef(-1);
  const [state, setState] = React.useState(initialValue);

  const debouncer: typeof setState = (state) => {
    // Do we already have a timeout pending?
    if (handle.current > -1) {
      // Clear it
      window.clearTimeout(handle.current);
    }

    // Create pending state update
    handle.current = window.setTimeout(() => {
      // Clear handle value once timeout has expired
      handle.current = -1;
      setState(state);
    }, timeout);
  };

  return [state, debouncer] as const;
};
