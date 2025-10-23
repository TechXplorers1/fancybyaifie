'use client';

import { useMemo } from 'react';

export function useMemoFirebase<T>(factory: () => T, deps: any[]): T {
  return useMemo(() => {
    const obj = factory();

    if(obj) {
      (obj as any).__memoized = true;
    }
    
    return obj;
  }, deps);
}
