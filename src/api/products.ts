import axios, { type AxiosInstance, type AxiosError } from "axios";
import type { Product, Category } from "@/types";

const API_BASE_URL = "https://fakestoreapi.com";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleApiError = (error: AxiosError): never => {
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 404:
        throw new Error("Resource not found. Please try again later.");
      case 500:
        throw new Error("Server error. Please try again later.");
      default:
        throw new Error(`Request failed with status ${status}`);
    }
  } else if (error.request) {
    throw new Error("Network error. Please check your internet connection.");
  } else {
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

export const api = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get<Product[]>("/products");
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  getProductById: async (id: number): Promise<Product> => {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<Category[]>("/products/categories");
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      const response = await apiClient.get<Product[]>(
        `/products/category/${encodeURIComponent(category)}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error as AxiosError);
    }
  },
};

export default api;
