import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favorites: number[];
  toggleFavorite: (productId: number) => void;
  addFavorite: (productId: number) => void;
  removeFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (productId: number) => {
        set((state) => ({
          favorites: state.favorites.includes(productId)
            ? state.favorites.filter((id) => id !== productId)
            : [...state.favorites, productId],
        }));
      },

      addFavorite: (productId: number) => {
        set((state) => ({
          favorites: state.favorites.includes(productId)
            ? state.favorites
            : [...state.favorites, productId],
        }));
      },

      removeFavorite: (productId: number) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== productId),
        }));
      },

      isFavorite: (productId: number) => {
        return get().favorites.includes(productId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: "shopwise-favorites",
    }
  )
);
