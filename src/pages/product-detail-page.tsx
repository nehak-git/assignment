import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Star,
  ShoppingCart,
  Share2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorMessage } from "@/components/common";
import { useProductsStore, useFavoritesStore } from "@/stores";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = id ? parseInt(id, 10) : null;
  
  const { currentProduct, isLoadingProduct, productError, fetchProductById } = useProductsStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => {
    if (productId !== null) {
      fetchProductById(productId);
    }
  }, [productId, fetchProductById]);

  const favorite = currentProduct ? isFavorite(currentProduct.id) : false;

  const handleFavoriteClick = () => {
    if (currentProduct) {
      toggleFavorite(currentProduct.id);
      toast.success(
        favorite ? "Removed from favorites" : "Added to favorites"
      );
    }
  };

  const handleShare = async () => {
    if (navigator.share && currentProduct) {
      try {
        await navigator.share({
          title: currentProduct.title,
          text: `Check out this product: ${currentProduct.title}`,
          url: window.location.href,
        });
      } catch {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" disabled className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/products")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        <ErrorMessage
          title="Product not found"
          message={productError}
          onRetry={() => productId && fetchProductById(productId)}
          variant="card"
        />
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          title="Product not found"
          message="The product you're looking for doesn't exist."
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/products")}
        className="mb-8 hover:bg-accent"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square bg-white p-8 flex items-center justify-center">
              <img
                src={currentProduct.image}
                alt={currentProduct.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Badge variant="secondary" className="capitalize">
            {currentProduct.category}
          </Badge>

          <h1 className="text-2xl md:text-3xl font-bold">{currentProduct.title}</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-semibold">{currentProduct.rating.rate}</span>
              </div>
              <span className="text-muted-foreground">
                ({currentProduct.rating.count} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              ${currentProduct.price.toFixed(2)}
            </span>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {currentProduct.description}
            </p>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant={favorite ? "default" : "outline"}
              onClick={handleFavoriteClick}
              className={cn(
                favorite && "bg-red-500 hover:bg-red-600 text-white"
              )}
            >
              <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
            </Button>
            <Button size="lg" variant="outline" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-sm">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-muted-foreground">On orders over $50</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="pt-4">
            <Link
              to={`/products?category=${encodeURIComponent(currentProduct.category)}`}
              className="text-sm text-primary hover:underline"
            >
              Browse more in {currentProduct.category} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
