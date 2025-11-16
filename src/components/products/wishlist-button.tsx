
"use client"

import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/models/Product";

export default function WishlistButton({ product, className }: { product: IProduct, className?: string }) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const onWishlist = isInWishlist(product._id);

    const handleWishlistClick = () => {
        if (onWishlist) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <Button size="lg" variant="outline" onClick={handleWishlistClick} aria-label="Add to wishlist" className={cn(className)}>
            <Heart className={cn("mr-2 h-5 w-5", onWishlist && "fill-destructive text-destructive")} />
            {onWishlist ? "On Wishlist" : "Add to Wishlist"}
        </Button>
    )
}
