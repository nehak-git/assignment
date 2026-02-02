import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="font-display text-8xl text-muted-foreground/30 mb-4">404</p>
      <h1 className="font-display text-2xl mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-8 max-w-sm">
        The page you're looking for doesn't exist.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  );
}
