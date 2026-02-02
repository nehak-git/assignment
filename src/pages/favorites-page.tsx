import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard, ProductCardSkeleton, EmptyState } from "@/components/common";
import { useProductsStore, useFavoritesStore } from "@/stores";

export function FavoritesPage() {
  const { products, isLoading, fetchProducts } = useProductsStore();
  const { favorites } = useFavoritesStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));
  const favoritesCount = favorites.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            My Favorites
          </h1>
          <p className="text-muted-foreground">
            {favoritesCount > 0
              ? `You have ${favoritesCount} item${favoritesCount !== 1 ? "s" : ""} saved`
              : "Items you've saved will appear here"}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCardSkeleton count={4} />
        </div>
      )}

      {!isLoading && favorites.length === 0 && (
        <EmptyState
          icon={<Heart className="h-8 w-8 text-muted-foreground" />}
          title="No favorites yet"
          description="Start adding products to your favorites by clicking the heart icon on any product."
          action={{
            label: "Browse Products",
            onClick: () => {},
          }}
        />
      )}

      {!isLoading && favorites.length > 0 && favoriteProducts.length === 0 && (
        <EmptyState
          icon={<Trash2 className="h-8 w-8 text-muted-foreground" />}
          title="Products unavailable"
          description="Some of your favorited products are no longer available."
        />
      )}

      {!isLoading && favoriteProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!isLoading && favorites.length === 0 && (
        <div className="mt-8 text-center">
          <Button asChild>
            <Link to="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
