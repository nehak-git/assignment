import { create } from "zustand";
import { api } from "@/api";
import type { Product, Category } from "@/types";

interface ProductsState {
  products: Product[];
  categories: Category[];
  currentProduct: Product | null;
  isLoading: boolean;
  isLoadingProduct: boolean;
  isLoadingCategories: boolean;
  error: string | null;
  productError: string | null;
  categoriesError: string | null;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  categories: [],
  currentProduct: null,
  isLoading: false,
  isLoadingProduct: false,
  isLoadingCategories: false,
  error: null,
  productError: null,
  categoriesError: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await api.getProducts();
      set({ products, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch products",
        isLoading: false,
      });
    }
  },

  fetchProductById: async (id: number) => {
    set({ isLoadingProduct: true, productError: null, currentProduct: null });
    try {
      const product = await api.getProductById(id);
      set({ currentProduct: product, isLoadingProduct: false });
    } catch (err) {
      set({
        productError: err instanceof Error ? err.message : "Failed to fetch product",
        isLoadingProduct: false,
      });
    }
  },

  fetchCategories: async () => {
    set({ isLoadingCategories: true, categoriesError: null });
    try {
      const categories = await api.getCategories();
      set({ categories, isLoadingCategories: false });
    } catch (err) {
      set({
        categoriesError: err instanceof Error ? err.message : "Failed to fetch categories",
        isLoadingCategories: false,
      });
    }
  },
}));
