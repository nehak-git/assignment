import { apiRequest } from "./client";
import type { Product, Category } from "@/types";

export const api = {
  getProducts: async (): Promise<Product[]> => {
    return apiRequest<Product[]>({ url: "/products", method: "GET" });
  },

  getProductById: async (id: number): Promise<Product> => {
    return apiRequest<Product>({ url: `/products/${id}`, method: "GET" });
  },

  getCategories: async (): Promise<Category[]> => {
    return apiRequest<Category[]>({ url: "/products/categories", method: "GET" });
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    return apiRequest<Product[]>({
      url: `/products/category/${encodeURIComponent(category)}`,
      method: "GET",
    });
  },
};

export default api;
