import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: "default" | "inline" | "card";
}

export function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
  className,
  variant = "default",
}: ErrorMessageProps) {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2 text-destructive text-sm", className)}>
        <AlertCircle className="h-4 w-4" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 text-center",
      variant === "card" && "rounded-lg border p-8",
      className
    )}>
      <AlertCircle className="h-8 w-8 text-muted-foreground mb-4" />
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      )}
    </div>
  );
}
