import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShoppingBag,
  Star,
  Shield,
  Truck,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard, ProductCardSkeleton, ErrorMessage } from "@/components/common";
import { useProductsStore } from "@/stores";

const features = [
  {
    icon: <ShoppingBag className="h-6 w-6" />,
    title: "Wide Selection",
    description: "Browse through thousands of products across multiple categories",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Quality Products",
    description: "All products are carefully curated and quality assured",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Shopping",
    description: "Your data is protected with industry-standard security",
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Fast Delivery",
    description: "Get your orders delivered quickly to your doorstep",
  },
];

export function HomePage() {
  const { products, isLoading, error, fetchProducts } = useProductsStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const featuredProducts = [...products]
    .sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(0, 4);

  return (
    <div className="flex flex-col">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Welcome to <span className="text-primary">ShopWise</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing products at unbeatable prices. Browse our collection,
              save your favorites, and find exactly what you're looking for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link to="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/favorites">
                  <Heart className="mr-2 h-5 w-5" />
                  View Favorites
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Why Shop With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
              <p className="text-muted-foreground mt-1">
                Our top-rated items you'll love
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {error && (
            <ErrorMessage
              message={error}
              onRetry={fetchProducts}
              variant="card"
              className="my-8"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <ProductCardSkeleton count={4} />
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Explore our full catalog of products and find the perfect items for you.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/products">
              Explore All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
