import axios, { type AxiosInstance, type AxiosError, type AxiosRequestConfig } from "axios";

const API_BASE_URL = "https://fakestoreapi.com";
const DEFAULT_TIMEOUT = 10000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  isNetworkError: boolean;
  isTimeout: boolean;
  isServerError: boolean;
  isNotFound: boolean;
}

export const createApiError = (error: AxiosError): ApiError => {
  const isNetworkError = !error.response && !!error.request;
  const isTimeout = error.code === "ECONNABORTED";
  const status = error.response?.status;
  const isServerError = status !== undefined && status >= 500;
  const isNotFound = status === 404;

  let message = "An unexpected error occurred";

  if (isTimeout) {
    message = "Request timed out. Please try again.";
  } else if (isNetworkError) {
    message = "Network error. Please check your connection.";
  } else if (isNotFound) {
    message = "The requested resource was not found.";
  } else if (isServerError) {
    message = "Server error. Please try again later.";
  } else if (status === 400) {
    message = "Invalid request. Please try again.";
  } else if (status === 401 || status === 403) {
    message = "You don't have permission to access this resource.";
  } else if (status === 429) {
    message = "Too many requests. Please slow down.";
  }

  return {
    message,
    status,
    code: error.code,
    isNetworkError,
    isTimeout,
    isServerError,
    isNotFound,
  };
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (error: AxiosError, attempt: number): boolean => {
  if (attempt >= MAX_RETRIES) return false;
  
  const status = error.response?.status;
  const isNetworkError = !error.response && !!error.request;
  const isTimeout = error.code === "ECONNABORTED";
  const isServerError = status !== undefined && status >= 500;
  
  return isNetworkError || isTimeout || isServerError;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API] Response ${response.status} from ${response.config.url}`);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export async function apiRequest<T>(
  config: AxiosRequestConfig,
  options?: { retries?: number; retryDelay?: number }
): Promise<T> {
  const maxRetries = options?.retries ?? MAX_RETRIES;
  const retryDelay = options?.retryDelay ?? RETRY_DELAY;
  
  let lastError: AxiosError | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await apiClient.request<T>(config);
      return response.data;
    } catch (error) {
      lastError = error as AxiosError;
      
      if (shouldRetry(lastError, attempt) && attempt < maxRetries) {
        const delay = retryDelay * Math.pow(2, attempt - 1);
        if (import.meta.env.DEV) {
          console.log(`[API] Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);
        }
        await sleep(delay);
      } else {
        break;
      }
    }
  }
  
  throw createApiError(lastError!);
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "isNetworkError" in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}
