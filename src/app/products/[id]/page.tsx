
import { getProductBySlug, getProducts } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import ProductRecommendations from '@/components/products/product-recommendations';
import AddToCartButton from '@/components/products/add-to-cart-button';
import WishlistButton from '@/components/products/wishlist-button';
import { Badge } from '@/components/ui/badge';
import BuyNowButton from '@/components/products/buy-now-button';
import ProductMediaGallery from '@/components/products/product-media-gallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import type { IProduct, IVariant } from '@/models/Product';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import VariantSelector from '@/components/products/variant-selector';

// Mock reviews as the static file was removed.
const reviews = [
    {id: '1', rating: 5, name: 'Customer', title: 'Great!', comment: 'Wonderful product.'},
    {id: '2', rating: 4, name: 'Another Customer', title: 'Good', comment: 'Pretty good.'}
]

interface ProductPageProps {
  params: {
    // This is the slug, not the id, despite the folder name
    id: string; 
  };
}


export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(product => ({
      id: product.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  // The param is named `id` due to the folder structure `[id]`, but it's the slug.
  const product = await getProductBySlug(params.id);

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };
  
  const isOnSale = product.salePrice && product.salePrice < product.price;

  const productForButtons = {
    ...JSON.parse(JSON.stringify(product)),
    id: product._id,
    image: product.media?.[0]?.url || '',
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
        <ProductMediaGallery media={product.media || []} isOnSale={!!isOnSale} alt={product.name}/>

        <div className="flex flex-col">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-4">
             <p className={`font-headline text-4xl font-bold ${isOnSale ? 'text-destructive' : 'text-primary'}`}>
                {formatPrice(isOnSale ? product.salePrice! : product.price)}
            </p>
            {isOnSale && (
                <p className="text-2xl text-muted-foreground line-through">
                    {formatPrice(product.price)}
                </p>
            )}
          </div>
          <div className="mt-6 prose text-muted-foreground max-w-none">
            <p>{product.description}</p>
          </div>
           
          <VariantSelector product={productForButtons as any} />

        </div>
      </div>
       <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="description">Full Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card>
                <CardContent className="p-6 text-muted-foreground prose max-w-none">
                    <p>{product.description}</p>
                    {/* Add more detailed description if available */}
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
             <Card>
                 <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {reviews.slice(0,2).map((review) => (
                        <div key={review.id}>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold">{review.name}</p>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}/>
                                    ))}
                                </div>
                            </div>
                            <h4 className="mt-1 font-medium">{review.title}</h4>
                            <p className="mt-1 text-muted-foreground">{review.comment}</p>
                        </div>
                    ))}
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-16 md:mt-24">
        <ProductRecommendations currentProductId={product._id} />
      </div>
    </div>
  );
}
