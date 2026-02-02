import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoritesStore, useCartStore } from "@/stores";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addToCart, isInCart } = useCartStore();
  const favorite = isFavorite(product.id);
  const inCart = isInCart(product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
    toast.success(favorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success("Added to cart");
  };

  return (
    <Link to={`/products/${product.id}`} className={cn("group block", className)}>
      <div className="space-y-3">
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity",
              favorite && "opacity-100 text-red-500"
            )}
            onClick={handleFavoriteClick}
          >
            <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
          </Button>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium line-clamp-1">
            {product.title}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-3 w-3 fill-current text-amber-500" />
              <span className="text-xs">{product.rating.rate}</span>
            </div>
          </div>

          <Button
            variant={inCart ? "secondary" : "outline"}
            size="sm"
            className="w-full mt-2 h-8 text-xs"
            onClick={handleAddToCart}
          >
            {inCart ? "In Cart" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
