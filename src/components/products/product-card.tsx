
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { PlusCircle, Heart, ImageOff } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import type { IProduct } from '@/models/Product';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const imageUrl = product.media && product.media.length > 0 ? product.media[0].url : null;
  const isOnSale = product.salePrice && product.salePrice < product.price;
  const onWishlist = isInWishlist(product._id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product as any);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const productForCart = {
        id: product._id,
        productId: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        image: imageUrl || '',
      };
      addToCart(productForCart as any);
  }

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          {isOnSale && (
            <Badge className="absolute top-2 left-2 z-10" variant="destructive">Sale</Badge>
          )}
          
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full bg-background/60 text-muted-foreground backdrop-blur-sm transition-all hover:bg-background"
              onClick={handleWishlistClick}
            >
              <Heart className={cn("h-5 w-5", onWishlist && "fill-destructive text-destructive")} />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 shrink-0 rounded-full bg-background/60 text-muted-foreground backdrop-blur-sm transition-all hover:bg-background md:hidden"
              onClick={handleAddToCart}
            >
              <PlusCircle className="h-5 w-5" />
              <span className="sr-only">Add to Cart</span>
            </Button>
          </div>

          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <ImageOff className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-base font-medium md:text-lg">
          <Link href={`/products/${product.slug}`} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <div className="flex-grow" />
        <div className="mt-2 flex items-baseline justify-between gap-4">
            <div className="flex flex-col">
                <p className={`text-lg font-semibold md:text-xl ${isOnSale ? 'text-destructive' : 'text-primary'}`}>
                    {formatPrice(isOnSale ? product.salePrice! : product.price)}
                </p>
                {isOnSale && (
                <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.price)}
                </p>
                )}
            </div>
        </div>
      </CardContent>
      <div className="hidden p-4 pt-0 md:block">
        <Button onClick={handleAddToCart} className="w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
