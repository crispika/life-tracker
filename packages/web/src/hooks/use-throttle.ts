import { useCallback, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  const lastExecuted = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastExecuted.current >= delay) {
        lastExecuted.current = now;
        return fn(...args);
      }
    },
    [fn, delay]
  ) as T;
}
