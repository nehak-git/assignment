import { useEffect } from "react";
import { Search } from "lucide-react";
import {
  ProductCard,
  ProductCardSkeleton,
  ErrorMessage,
  EmptyState,
  SearchAndFilter,
} from "@/components/common";
import { useProductsStore, useFiltersStore } from "@/stores";

export function ProductsPage() {
  const { products, categories, isLoading, isLoadingCategories, error, fetchProducts, fetchCategories } = useProductsStore();
  const { filters, filterAndSortProducts } = useFiltersStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [products.length, categories.length, fetchProducts, fetchCategories]);

  const filteredProducts = filterAndSortProducts(products);
  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.category !== "all" ||
    filters.sortBy !== "default";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Products</h1>
        <p className="text-muted-foreground">
          Browse our complete collection of products
        </p>
      </div>

      <div className="mb-8">
        <SearchAndFilter
          categories={categories}
          isLoadingCategories={isLoadingCategories}
        />
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchProducts}
          variant="card"
          className="my-8"
        />
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="mb-6 text-sm text-muted-foreground">
          {hasActiveFilters ? (
            <span>
              Showing {filteredProducts.length} of {products.length} products
            </span>
          ) : (
            <span>Showing all {products.length} products</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <ProductCardSkeleton count={8} />
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : null}
      </div>

      {!isLoading && !error && filteredProducts.length === 0 && (
        <EmptyState
          icon={<Search className="h-8 w-8 text-muted-foreground" />}
          title="No products found"
          description={
            hasActiveFilters
              ? "Try adjusting your search or filter criteria"
              : "No products available at the moment"
          }
        />
      )}
    </div>
  );
}
