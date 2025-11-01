import { getProductById, products } from '@/lib/products';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ProductRecommendations from '@/components/products/product-recommendations';
import AddToCartButton from '@/components/products/add-to-cart-button';
import { Badge } from '@/components/ui/badge';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
    return products.map(product => ({
        id: product.id,
    }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  const isOnSale = product.salePrice && product.salePrice < product.price;


  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-lg border bg-card shadow-sm relative">
          {isOnSale && (
            <Badge className="absolute top-4 left-4 z-10 text-lg" variant="destructive">Sale</Badge>
          )}
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            className="h-full w-full object-cover"
            data-ai-hint={product.imageHint}
            priority
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{product.description}</p>
          <div className="mt-6 flex items-baseline gap-4">
             <p className={`font-headline text-4xl font-bold ${isOnSale ? 'text-destructive' : 'text-primary'}`}>
                {formatPrice(isOnSale ? product.salePrice! : product.price)}
            </p>
            {isOnSale && (
                <p className="text-2xl text-muted-foreground line-through">
                    {formatPrice(product.price)}
                </p>
            )}
          </div>
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
      <div className="mt-16 md:mt-24">
        <ProductRecommendations currentProductId={product.id} />
      </div>
    </div>
  );
}
