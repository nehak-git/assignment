import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard, ProductCardSkeleton, EmptyState } from "@/components/common";
import { useProductsStore, useFavoritesStore } from "@/stores";

export function FavoritesPage() {
  const navigate = useNavigate();
  const { products, isLoading, fetchProducts } = useProductsStore();
  const { favorites, clearFavorites } = useFavoritesStore();

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [products.length, fetchProducts]);

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl mb-1">Favorites</h1>
          <p className="text-muted-foreground text-sm">
            {favorites.length} {favorites.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        {favorites.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFavorites}>
            Clear all
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <ProductCardSkeleton count={4} />
        </div>
      )}

      {!isLoading && favorites.length === 0 && (
        <EmptyState
          icon={<Heart className="h-8 w-8 text-muted-foreground" />}
          title="No favorites yet"
          description="Items you like will appear here"
          action={{
            label: "Browse Products",
            onClick: () => navigate("/products"),
          }}
        />
      )}

      {!isLoading && favoriteProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
