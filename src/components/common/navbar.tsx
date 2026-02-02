import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Heart, Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavoritesStore, useThemeStore } from "@/stores";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
  { label: "Products", href: "/products", icon: <ShoppingBag className="h-4 w-4" /> },
  { label: "Favorites", href: "/favorites", icon: <Heart className="h-4 w-4" /> },
];

export function Navbar() {
  const location = useLocation();
  const { isDark, toggleTheme } = useThemeStore();
  const favoritesCount = useFavoritesStore((state) => state.favorites.length);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">ShopWise</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {item.icon}
                {item.label}
                {item.label === "Favorites" && favoritesCount > 0 && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-1 h-5 min-w-5 flex items-center justify-center px-1.5",
                      isActive(item.href) && "bg-primary-foreground text-primary"
                    )}
                  >
                    {favoritesCount}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {item.icon}
                  {item.label}
                  {item.label === "Favorites" && favoritesCount > 0 && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "ml-auto",
                        isActive(item.href) && "bg-primary-foreground text-primary"
                      )}
                    >
                      {favoritesCount}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
