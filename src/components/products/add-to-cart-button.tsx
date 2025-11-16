
"use client"

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import type { CartProduct } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

export default function AddToCartButton({ product, className }: { product: CartProduct, className?: string }) {
    const { addToCart } = useCart();

    return (
        <Button size="lg" onClick={() => addToCart(product)} className={cn(className)}>
            <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
    )
}
