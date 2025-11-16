
import { getProductBySlug, getProducts } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import ProductRecommendations from '@/components/products/product-recommendations';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import type { IProduct } from '@/models/Product';
import VariantSelector from '@/components/products/variant-selector';
import ProductMediaGallery from '@/components/products/product-media-gallery';
import { getReviewsForProduct } from '@/lib/actions/review.actions';
import ProductReviews from '@/components/products/product-reviews';
import { Star, FileText, List, MessageSquare } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <ProductMediaGallery media={product.media || []} isOnSale={!!isOnSale} alt={product.name}/>

        <div className="flex flex-col py-4 md:py-0">
           <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.averageRating) ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.numReviews} reviews)</span>
          </div>
          
          <div className="mt-4">
             <div className={`text-2xl font-bold tracking-tight md:text-3xl ${isOnSale ? 'text-destructive' : 'text-primary'}`}>
                {formatPrice(isOnSale ? product.salePrice! : product.price)}
            </div>
            {isOnSale && (
                <div className="text-base text-muted-foreground line-through md:text-lg">
                    {formatPrice(product.price)}
                </div>
            )}
          </div>

          <div className="mt-6 text-sm text-muted-foreground prose-sm max-w-none md:prose-base">
            <p>{product.description}</p>
          </div>
           
          <VariantSelector product={productForButtons as any} />

        </div>
      </div>
       <div className="mt-12 md:mt-16">
        <Accordion type="multiple" defaultValue={['description', 'specifications', 'reviews']} className="w-full space-y-4">
          <AccordionItem value="description">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>Description</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="p-4 text-sm text-muted-foreground prose-sm max-w-none">
                    <p>{product.description}</p>
                </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="specifications">
            <AccordionTrigger className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <List className="h-5 w-5" />
                <span>Specifications</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4">
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
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="reviews">
            <AccordionTrigger className="text-lg font-medium">
               <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span>Reviews ({reviews.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4">
                <ProductReviews productId={product._id} initialReviews={reviews} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mt-16 md:mt-24">
        <ProductRecommendations currentProductId={product._id} />
      </div>
    </div>
  );
}
