"use client"

import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WishlistButton({ product }: { product: Product }) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const onWishlist = isInWishlist(product.id);

    const handleWishlistClick = () => {
        if (onWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <Button size="lg" variant="outline" onClick={handleWishlistClick} aria-label="Add to wishlist">
            <Heart className={cn("mr-2 h-5 w-5", onWishlist && "fill-destructive text-destructive")} />
            {onWishlist ? "On Wishlist" : "Add to Wishlist"}
        </Button>
    )
}
