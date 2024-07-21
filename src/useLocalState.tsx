import { useState, useCallback } from "react";

export function useLocalState<T>(key: string, initial: T): [T, (t: T) => void] {
  const [state, setState] = useState(() => {
    const saves = localStorage.getItem(key);
    if (saves) return JSON.parse(saves);
    return initial;
  });
  const setActualState = useCallback((value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
    setState(value);
  }, []);

  return [state, setActualState];
}
