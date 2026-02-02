import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/api";
import { getErrorMessage } from "@/api/client";
import type { Product } from "@/types";

interface UseProductsOptions {
  enabled?: boolean;
  staleTime?: number;
}

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}

const cache: {
  data: Product[] | null;
  timestamp: number | null;
} = {
  data: null,
  timestamp: null,
};

const DEFAULT_STALE_TIME = 5 * 60 * 1000;

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const { enabled = true, staleTime = DEFAULT_STALE_TIME } = options;
  
  const [products, setProducts] = useState<Product[]>(cache.data ?? []);
  const [isLoading, setIsLoading] = useState(!cache.data);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const fetchingRef = useRef(false);

  const isCacheValid = useCallback(() => {
    if (!cache.data || !cache.timestamp) return false;
    return Date.now() - cache.timestamp < staleTime;
  }, [staleTime]);

  const fetchProducts = useCallback(async (force = false) => {
    if (fetchingRef.current) return;
    
    if (!force && isCacheValid()) {
      setProducts(cache.data!);
      setIsLoading(false);
      return;
    }

    fetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getProducts();
      cache.data = data;
      cache.timestamp = Date.now();
      setProducts(data);
      setIsStale(false);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      if (cache.data) {
        setProducts(cache.data);
        setIsStale(true);
      }
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [isCacheValid]);

  const refetch = useCallback(async () => {
    await fetchProducts(true);
  }, [fetchProducts]);

  useEffect(() => {
    if (enabled) {
      fetchProducts();
    }
  }, [enabled, fetchProducts]);

  return {
    products,
    isLoading,
    error,
    refetch,
    isStale,
  };
}
