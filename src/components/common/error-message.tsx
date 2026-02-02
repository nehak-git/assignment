import { AlertCircle, RefreshCcw, WifiOff } from "lucide-react";
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
  const isNetworkError = message.toLowerCase().includes("network");

  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-destructive text-sm",
          className
        )}
      >
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8 text-center",
        variant === "card" && "rounded-lg border bg-card",
        className
      )}
    >
      <div className="rounded-full bg-destructive/10 p-4">
        {isNetworkError ? (
          <WifiOff className="h-8 w-8 text-destructive" />
        ) : (
          <AlertCircle className="h-8 w-8 text-destructive" />
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
