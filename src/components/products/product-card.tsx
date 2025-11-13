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
        ...product,
        id: product._id,
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
        <CardTitle className="mb-2 text-lg font-medium">
          <Link href={`/products/${product.slug}`} className="hover:text-primary">
            {product.name}
          </Link>
        </CardTitle>
        <div className="flex-grow" />
        <div className="flex items-baseline gap-2">
            <p className={`font-headline text-xl font-semibold ${isOnSale ? 'text-destructive' : 'text-primary'}`}>
                {formatPrice(isOnSale ? product.salePrice! : product.price)}
            </p>
            {isOnSale && (
                <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.price)}
                </p>
            )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
