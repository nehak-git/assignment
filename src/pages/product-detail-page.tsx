import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, Star, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/common";
import { useProductsStore, useFavoritesStore, useCartStore } from "@/stores";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = id ? parseInt(id, 10) : null;
  
  const { currentProduct, isLoadingProduct, productError, fetchProductById } = useProductsStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addToCart, isInCart } = useCartStore();

  useEffect(() => {
    if (productId !== null) fetchProductById(productId);
  }, [productId, fetchProductById]);

  const favorite = currentProduct ? isFavorite(currentProduct.id) : false;
  const inCart = currentProduct ? isInCart(currentProduct.id) : false;

  const handleFavoriteClick = () => {
    if (currentProduct) {
      toggleFavorite(currentProduct.id);
      toast.success(favorite ? "Removed from favorites" : "Added to favorites");
    }
  };

  const handleAddToCart = () => {
    if (currentProduct) {
      addToCart(currentProduct);
      toast.success("Added to cart");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied");
  };

  if (isLoadingProduct) {
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

  if (productError || !currentProduct) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Button variant="ghost" onClick={() => navigate("/products")} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <ErrorMessage
          title="Product not found"
          message={productError || "This product doesn't exist."}
          onRetry={() => productId && fetchProductById(productId)}
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
            src={currentProduct.image}
            alt={currentProduct.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground capitalize mb-2">
              {currentProduct.category}
            </p>
            <h1 className="font-display text-2xl md:text-3xl mb-3">
              {currentProduct.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>{currentProduct.rating.rate}</span>
              <span>·</span>
              <span>{currentProduct.rating.count} reviews</span>
            </div>
          </div>

          <p className="text-2xl font-medium">
            ${currentProduct.price.toFixed(2)}
          </p>

          <p className="text-muted-foreground leading-relaxed">
            {currentProduct.description}
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

          <div className="pt-6 border-t text-sm text-muted-foreground">
            <p>Free shipping on orders over $50</p>
          </div>

          <Link
            to={`/products?category=${encodeURIComponent(currentProduct.category)}`}
            className="inline-block text-sm text-primary hover:underline"
          >
            More in {currentProduct.category} →
          </Link>
        </div>
      </div>
    </div>
  );
}
