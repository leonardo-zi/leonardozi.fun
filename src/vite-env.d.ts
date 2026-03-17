/// <reference types="vite/client" />

declare global {
  interface Window {
    Lenis?: new (options?: Record<string, unknown>) => {
      raf: (time: number) => void;
      destroy: () => void;
      on: (event: string, cb: (...args: unknown[]) => void) => void;
    };
  }
}

export {};
