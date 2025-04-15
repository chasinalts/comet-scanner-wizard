interface SimulateOptions {
  successRate?: number;
  minDelay?: number;
  maxDelay?: number;
  errorTypes?: ('network' | 'server' | 'validation')[];
  signal?: AbortSignal;
}

export class ApiError extends Error {
  constructor(
    public type: 'network' | 'server' | 'validation' | 'abort',
    public status?: number,
    message?: string
  ) {
    super(message || `${type} error occurred`);
    this.name = 'ApiError';
  }
}

const getRandomDelay = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomError = (types: ('network' | 'server' | 'validation')[]): ApiError => {
  const type = types[Math.floor(Math.random() * types.length)];
  switch (type) {
    case 'network':
      return new ApiError('network', 0, 'Network connection failed');
    case 'server':
      return new ApiError('server', 500, 'Internal server error');
    case 'validation':
      return new ApiError('validation', 400, 'Validation failed');
    default:
      return new ApiError('server', 500, 'Unknown error occurred');
  }
};

export const simulateApi = async <T>(
  response: T,
  options: SimulateOptions = {}
): Promise<T> => {
  const {
    successRate = 0.8,
    minDelay = 500,
    maxDelay = 2000,
    errorTypes = ['network', 'server'],
    signal
  } = options;

  return new Promise((resolve, reject) => {
    // Simulate network delay
    const delay = getRandomDelay(minDelay, maxDelay);
    const timeoutId = setTimeout(() => {
      // Simulate random failures
      if (Math.random() > successRate) {
        reject(getRandomError(errorTypes));
      } else {
        resolve(response);
      }
    }, delay);

    // Handle abortion
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new ApiError('abort', 0, 'Operation canceled'));
      });
    }
  });
};

export const mockProfileApi = {
  validateProfile: async (_data: any, signal?: AbortSignal) => {
    return simulateApi(
      { isValid: true },
      {
        successRate: 0.9,
        minDelay: 300,
        maxDelay: 800,
        errorTypes: ['validation'],
        signal
      }
    );
  },

  updateProfile: async (data: any, signal?: AbortSignal) => {
    return simulateApi(
      { success: true, data },
      {
        successRate: 0.7,
        minDelay: 1000,
        maxDelay: 3000,
        errorTypes: ['network', 'server', 'validation'],
        signal
      }
    );
  },

  updateNotifications: async (settings: any, signal?: AbortSignal) => {
    return simulateApi(
      { updated: true, settings },
      {
        successRate: 0.8,
        minDelay: 500,
        maxDelay: 1500,
        errorTypes: ['network', 'server'],
        signal
      }
    );
  }
};

export type ApiErrorType = ApiError;