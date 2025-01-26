import { useEffect, useState } from "react";

export function useLocalState<T>(key: string, initial: () => T) {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved) as T;
    return initial();
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return { state, setState };
}
