import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardSkeletonProps {
  count?: number;
}

export function ProductCardSkeleton({ count = 1 }: ProductCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="aspect-square bg-muted p-4">
            <Skeleton className="h-full w-full" />
          </div>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-24" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
