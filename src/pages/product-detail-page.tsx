import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, Star, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/common";
import { useFavoritesStore, useCartStore } from "@/stores";
import { useProduct } from "@/hooks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = id ? parseInt(id, 10) : null;
  
  const { product, isLoading, error, refetch } = useProduct(productId);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addToCart, isInCart } = useCartStore();

  const favorite = product ? isFavorite(product.id) : false;
  const inCart = product ? isInCart(product.id) : false;

  const handleFavoriteClick = () => {
    if (product) {
      toggleFavorite(product.id);
      toast.success(favorite ? "Removed from favorites" : "Added to favorites");
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success("Added to cart");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Button variant="ghost" onClick={() => navigate("/products")} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <ErrorMessage
          title="Product not found"
          message={error || "This product doesn't exist."}
          onRetry={refetch}
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <Button variant="ghost" onClick={() => navigate("/products")} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="aspect-square bg-muted rounded-lg p-8 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground capitalize mb-2">
              {product.category}
            </p>
            <h1 className="text-2xl md:text-3xl mb-3">
              {product.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>{product.rating.rate}</span>
              <span>·</span>
              <span>{product.rating.count} reviews</span>
            </div>
          </div>

          <p className="text-2xl font-medium">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="flex gap-3 pt-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              variant={inCart ? "secondary" : "default"}
            >
              {inCart ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Added
                </>
              ) : (
                "Add to Cart"
              )}
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={handleFavoriteClick}
              className={cn(favorite && "text-red-500 border-red-200 hover:bg-red-50")}
            >
              <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
            </Button>
            
            <Button size="lg" variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className="inline-block text-sm text-primary hover:underline pt-4"
          >
            More in {product.category} →
          </Link>
        </div>
      </div>
    </div>
  );
}
