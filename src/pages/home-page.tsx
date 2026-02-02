import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard, ProductCardSkeleton, ErrorMessage } from "@/components/common";
import { useProductsStore } from "@/stores";

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
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-xl space-y-6">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
              Curated products for modern living
            </h1>
            <p className="text-muted-foreground text-lg">
              A thoughtful selection of quality essentials.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/products">
                Browse Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-2xl md:text-3xl">Featured</h2>
            <Link 
              to="/products" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all
            </Link>
          </div>

          {error && (
            <ErrorMessage
              message={error}
              onRetry={fetchProducts}
              variant="card"
              className="my-8"
            />
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

      <section className="py-16 md:py-24 border-t bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { title: "Free Shipping", desc: "On orders over $50" },
              { title: "Easy Returns", desc: "30 day return policy" },
              { title: "Secure Checkout", desc: "100% protected payments" },
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
