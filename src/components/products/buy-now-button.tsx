"use client"

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

export default function BuyNowButton({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const router = useRouter();

    const handleBuyNow = () => {
        addToCart(product, 1, false); // Add to cart without showing toast
        router.push('/checkout');
    };

    return (
        <Button size="lg" variant="secondary" onClick={handleBuyNow}>
            <ShoppingBag className="mr-2 h-5 w-5" /> Buy Now
        </Button>
    )
}
