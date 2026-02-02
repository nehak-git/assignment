import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/common";
import { useCartStore } from "@/stores";
import { toast } from "sonner";

export function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCartStore();

  const handleRemoveItem = (productId: number, title: string) => {
    removeFromCart(productId);
    toast.success(`${title} removed`);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="font-display text-3xl mb-8">Cart</h1>
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8 text-muted-foreground" />}
          title="Your cart is empty"
          description="Add some items to get started"
          action={{
            label: "Browse Products",
            onClick: () => navigate("/products"),
          }}
        />
      </div>
    );
  }

  const subtotal = totalPrice();

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Cart</h1>
        <Button variant="ghost" size="sm" onClick={() => { clearCart(); toast.success("Cart cleared"); }}>
          Clear all
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 p-4 border rounded-lg">
              <Link
                to={`/products/${product.id}`}
                className="shrink-0 w-20 h-20 bg-muted rounded-md overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain p-2"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/products/${product.id}`} className="font-medium text-sm line-clamp-1 hover:underline">
                  {product.title}
                </Link>
                <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                <p className="font-medium mt-1">${product.price.toFixed(2)}</p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleRemoveItem(product.id, product.title)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => decrementQuantity(product.id)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center text-sm">{quantity}</span>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => incrementQuantity(product.id)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="font-medium mb-4">Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({totalItems()} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-medium mb-6">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <Button className="w-full" size="lg">
              Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button variant="ghost" className="w-full mt-2" asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
