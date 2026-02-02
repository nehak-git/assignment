export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export type Category = string;

export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "name";

export interface ProductFilters {
  category: string;
  searchQuery: string;
  sortBy: SortOption;
  priceRange: {
    min: number;
    max: number;
  };
}
