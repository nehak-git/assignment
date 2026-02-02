import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/api";
import { getErrorMessage } from "@/api/client";
import type { Category } from "@/types";

interface UseCategoriesOptions {
  enabled?: boolean;
}

interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const cache: {
  data: Category[] | null;
  timestamp: number | null;
} = {
  data: null,
  timestamp: null,
};

const CACHE_TIME = 10 * 60 * 1000;

export function useCategories(options: UseCategoriesOptions = {}): UseCategoriesReturn {
  const { enabled = true } = options;
  
  const [categories, setCategories] = useState<Category[]>(cache.data ?? []);
  const [isLoading, setIsLoading] = useState(!cache.data);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const isCacheValid = useCallback(() => {
    if (!cache.data || !cache.timestamp) return false;
    return Date.now() - cache.timestamp < CACHE_TIME;
  }, []);

  const fetchCategories = useCallback(async (force = false) => {
    if (fetchingRef.current) return;
    
    if (!force && isCacheValid()) {
      setCategories(cache.data!);
      setIsLoading(false);
      return;
    }

    fetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getCategories();
      cache.data = data;
      cache.timestamp = Date.now();
      setCategories(data);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      if (cache.data) {
        setCategories(cache.data);
      }
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [isCacheValid]);

  const refetch = useCallback(async () => {
    await fetchCategories(true);
  }, [fetchCategories]);

  useEffect(() => {
    if (enabled) {
      fetchCategories();
    }
  }, [enabled, fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refetch,
  };
}
