import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavoritesStore } from "@/stores";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <Link to={`/products/${product.id}`}>
      <Card
        className={cn(
          "group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
          className
        )}
      >
        <div className="relative aspect-square bg-white p-4">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200",
              favorite && "opacity-100 bg-red-100 text-red-600 hover:bg-red-200"
            )}
            onClick={handleFavoriteClick}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
          </Button>

          <Badge
            variant="secondary"
            className="absolute bottom-2 left-2 capitalize text-xs"
          >
            {product.category}
          </Badge>
        </div>

        <CardContent className="p-4 space-y-3">
          <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">{product.rating.rate}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.rating.count} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
