
import { getProductBySlug, getProducts } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import ProductRecommendations from '@/components/products/product-recommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import type { IProduct } from '@/models/Product';
import VariantSelector from '@/components/products/variant-selector';
import ProductMediaGallery from '@/components/products/product-media-gallery';
import { getReviewsForProduct } from '@/lib/actions/review.actions';
import ProductReviews from '@/components/products/product-reviews';
import { Star } from 'lucide-react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

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
  
  const reviews = await getReviewsForProduct(product._id);


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
          <h1 className="text-3xl font-bold md:text-4xl">{product.name}</h1>
           <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.round(product.averageRating) ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`} />
              ))}
            </div>
            <span className="text-muted-foreground">({product.numReviews} reviews)</span>
          </div>
          <div className="mt-4 flex items-baseline gap-4">
             <p className={`font-headline text-3xl font-bold md:text-4xl ${isOnSale ? 'text-destructive' : 'text-primary'}`}>
                {formatPrice(isOnSale ? product.salePrice! : product.price)}
            </p>
            {isOnSale && (
                <p className="text-xl text-muted-foreground line-through md:text-2xl">
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
        <Tabs defaultValue="reviews">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="description">Full Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card>
                <CardContent className="p-6 text-muted-foreground prose max-w-none">
                    <p>{product.description}</p>
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <Card>
                <CardContent className="p-6">
                    <Table>
                        <TableBody>
                            {product.weight && (
                                <TableRow>
                                    <TableCell className="font-medium">Weight</TableCell>
                                    <TableCell>{product.weight} kg</TableCell>
                                </TableRow>
                            )}
                            {product.dimensions && (
                                <>
                                <TableRow>
                                    <TableCell className="font-medium">Length</TableCell>
                                    <TableCell>{product.dimensions.length} cm</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Width</TableCell>
                                    <TableCell>{product.dimensions.width} cm</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Height</TableCell>
                                    <TableCell>{product.dimensions.height} cm</TableCell>
                                </TableRow>
                                </>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
             <ProductReviews productId={product._id} initialReviews={reviews} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-16 md:mt-24">
        <ProductRecommendations currentProductId={product._id} />
      </div>
    </div>
  );
}
