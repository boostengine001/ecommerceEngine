
"use client"

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import type { CartProduct } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

export default function BuyNowButton({ product, className }: { product: CartProduct, className?: string }) {
    const { addToCart } = useCart();
    const router = useRouter();

    const handleBuyNow = () => {
        addToCart(product, 1, false); // Add to cart without showing toast
        router.push('/checkout');
    };

    return (
        <Button size="lg" variant="secondary" onClick={handleBuyNow} className={cn(className)}>
            <ShoppingBag className="mr-2 h-5 w-5" /> Buy Now
        </Button>
    )
}
