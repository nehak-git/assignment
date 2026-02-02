import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ProductCard,
  ProductCardSkeleton,
  ErrorMessage,
  EmptyState,
} from "@/components/common";
import { useFiltersStore } from "@/stores";
import { useProducts, useCategories } from "@/hooks";
import type { SortOption } from "@/types";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rating" },
  { value: "name", label: "Name" },
];

export function ProductsPage() {
  const { products, isLoading, error, refetch } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { filters, setSearchQuery, setCategory, setSortBy, resetFilters, filterAndSortProducts } = useFiltersStore();

  const filteredProducts = filterAndSortProducts(products);
  const hasActiveFilters = filters.searchQuery !== "" || filters.category !== "all" || filters.sortBy !== "default";

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl mb-2">Shop</h1>
        <p className="text-muted-foreground">
          {filteredProducts.length} products
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filters.category} onValueChange={setCategory} disabled={isLoadingCategories}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {error && (
        <ErrorMessage message={error} onRetry={refetch} variant="card" className="my-8" />
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading ? (
          <ProductCardSkeleton count={8} />
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {!isLoading && !error && filteredProducts.length === 0 && (
        <EmptyState
          title="No products found"
          description={hasActiveFilters ? "Try adjusting your filters" : "Check back soon"}
        />
      )}
    </div>
  );
}
