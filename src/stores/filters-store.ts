import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductFilters, SortOption, Product } from "@/types";

interface FiltersState {
  filters: ProductFilters;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  setPriceRange: (min: number, max: number) => void;
  resetFilters: () => void;
  filterAndSortProducts: (products: Product[]) => Product[];
}

const defaultFilters: ProductFilters = {
  category: "all",
  searchQuery: "",
  sortBy: "default",
  priceRange: { min: 0, max: 1000 },
};

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,

      setSearchQuery: (query: string) => {
        set((state) => ({
          filters: { ...state.filters, searchQuery: query },
        }));
      },

      setCategory: (category: string) => {
        set((state) => ({
          filters: { ...state.filters, category },
        }));
      },

      setSortBy: (sortBy: SortOption) => {
        set((state) => ({
          filters: { ...state.filters, sortBy },
        }));
      },

      setPriceRange: (min: number, max: number) => {
        set((state) => ({
          filters: { ...state.filters, priceRange: { min, max } },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      filterAndSortProducts: (products: Product[]): Product[] => {
        const { filters } = get();
        let filtered = [...products];

        if (filters.category !== "all") {
          filtered = filtered.filter((p) => p.category === filters.category);
        }

        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(query) ||
              p.description.toLowerCase().includes(query) ||
              p.category.toLowerCase().includes(query)
          );
        }

        filtered = filtered.filter(
          (p) =>
            p.price >= filters.priceRange.min &&
            p.price <= filters.priceRange.max
        );

        switch (filters.sortBy) {
          case "price-asc":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            filtered.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            filtered.sort((a, b) => b.rating.rate - a.rating.rate);
            break;
          case "name":
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
          default:
            break;
        }

        return filtered;
      },
    }),
    {
      name: "shopwise-filters",
    }
  )
);
