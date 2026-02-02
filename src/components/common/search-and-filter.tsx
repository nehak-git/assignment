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
import { useFiltersStore } from "@/stores";
import type { Category, SortOption } from "@/types";

interface SearchAndFilterProps {
  categories: Category[];
  isLoadingCategories?: boolean;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rating" },
  { value: "name", label: "Name A-Z" },
];

export function SearchAndFilter({
  categories,
  isLoadingCategories,
}: SearchAndFilterProps) {
  const { filters, setSearchQuery, setCategory, setSortBy, resetFilters } =
    useFiltersStore();

  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.category !== "all" ||
    filters.sortBy !== "default";

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {filters.searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Select
          value={filters.category}
          onValueChange={setCategory}
          disabled={isLoadingCategories}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="capitalize">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all filters
          </Button>
          {filters.searchQuery && (
            <span className="text-sm text-muted-foreground">
              Searching for "{filters.searchQuery}"
            </span>
          )}
        </div>
      )}
    </div>
  );
}
