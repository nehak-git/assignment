import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/api";
import { getErrorMessage } from "@/api/client";
import type { Product } from "@/types";

interface UseProductOptions {
  enabled?: boolean;
}

interface UseProductReturn {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const productCache = new Map<number, { data: Product; timestamp: number }>();
const CACHE_TIME = 5 * 60 * 1000;

export function useProduct(id: number | null, options: UseProductOptions = {}): UseProductReturn {
  const { enabled = true } = options;
  
  const [product, setProduct] = useState<Product | null>(() => {
    if (id === null) return null;
    const cached = productCache.get(id);
    if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
      return cached.data;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(() => {
    if (id === null) return false;
    const cached = productCache.get(id);
    return !cached || Date.now() - cached.timestamp >= CACHE_TIME;
  });
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);
  const currentIdRef = useRef(id);

  const fetchProduct = useCallback(async (productId: number, force = false) => {
    if (fetchingRef.current && currentIdRef.current === productId) return;
    
    const cached = productCache.get(productId);
    if (!force && cached && Date.now() - cached.timestamp < CACHE_TIME) {
      setProduct(cached.data);
      setIsLoading(false);
      return;
    }

    fetchingRef.current = true;
    currentIdRef.current = productId;
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getProductById(productId);
      productCache.set(productId, { data, timestamp: Date.now() });
      if (currentIdRef.current === productId) {
        setProduct(data);
      }
    } catch (err) {
      if (currentIdRef.current === productId) {
        const message = getErrorMessage(err);
        setError(message);
        const cachedData = productCache.get(productId);
        if (cachedData) {
          setProduct(cachedData.data);
        }
      }
    } finally {
      if (currentIdRef.current === productId) {
        setIsLoading(false);
      }
      fetchingRef.current = false;
    }
  }, []);

  const refetch = useCallback(async () => {
    if (id !== null) {
      await fetchProduct(id, true);
    }
  }, [id, fetchProduct]);

  useEffect(() => {
    if (!enabled || id === null) {
      setProduct(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    fetchProduct(id);
  }, [enabled, id, fetchProduct]);

  return {
    product,
    isLoading,
    error,
    refetch,
  };
}
