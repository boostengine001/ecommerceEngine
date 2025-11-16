
"use client";

import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Separator } from "@/components/ui/separator";
import CartItem from "./cart-item";
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingBag } from 'lucide-react';

interface CartSheetProps {
  children: React.ReactNode;
}

export function CartSheet({ children }: CartSheetProps) {
  const { cartItems, totalPrice, totalItems } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="pr-6">
          <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 py-4 pr-6">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="p-4 sm:p-6">
              <div className="flex w-full flex-col gap-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <SheetClose asChild>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground">Add some products to get started!</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
