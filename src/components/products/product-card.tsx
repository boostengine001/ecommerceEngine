
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="aspect-square overflow-hidden relative group">
             {isOnSale && (
                <Badge className="absolute top-2 left-2 z-10" variant="destructive">Sale</Badge>
              )}
             <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-10 h-9 w-9 rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-all hover:bg-background"
              onClick={handleWishlistClick}
            >
              <Heart className={cn("h-5 w-5", onWishlist && "fill-destructive text-destructive")} />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-2 right-2 z-10 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity md:hidden"
              onClick={handleAddToCart}
            >
              <PlusCircle className="h-5 w-5" />
              <span className="sr-only">Add to Cart</span>
            </Button>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                width={600}
                height={600}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <ImageOff className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <CardTitle className="mb-2 text-base font-medium md:text-lg">
          <Link href={`/products/${product.slug}`} className="hover:text-primary">
            {product.name}
          </Link>
        </CardTitle>
        <div className="flex-grow" />
        <div className="mt-2 flex items-end justify-between gap-4">
          <div className="grid gap-0.5">
            <p className={`font-headline text-lg font-semibold md:text-xl ${isOnSale ? 'text-destructive' : 'text-primary'}`}>
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
      <CardFooter className="hidden p-4 pt-0 md:flex">
        <Button onClick={handleAddToCart} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
