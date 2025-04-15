import { useRef, useCallback, useEffect } from 'react';

export function useAbortController() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const getSignal = useCallback(() => {
    // Clean up any existing controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new controller
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current.signal;
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return {
    getSignal,
    abort,
    isAborted: () => !abortControllerRef.current
  };
}

// Helper to create abortable promise
export function abortable<T>(
  promise: Promise<T>,
  signal: AbortSignal
): Promise<T> {
  return new Promise((resolve, reject) => {
    // Handle abort events
    signal.addEventListener('abort', () => {
      reject(new DOMException('Operation canceled', 'AbortError'));
    });

    promise.then(resolve).catch(reject);
  });
}

// Wrapper for fetch with abort signal
export function fetchWithAbort(
  input: RequestInfo,
  init?: RequestInit & { signal?: AbortSignal }
): Promise<Response> {
  const controller = new AbortController();
  const promise = fetch(input, {
    ...init,
    signal: controller.signal
  });

  if (init?.signal) {
    init.signal.addEventListener('abort', () => controller.abort());
  }

  return promise;
}

// Example usage:
/*
const MyComponent = () => {
  const { getSignal, abort } = useAbortController();

  const handleSubmit = async () => {
    try {
      const signal = getSignal();
      const result = await abortable(
        someAsyncOperation(),
        signal
      );
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Operation was canceled');
      }
    }
  };

  return (
    <button onClick={() => abort()}>
      Cancel Operation
    </button>
  );
};
*/