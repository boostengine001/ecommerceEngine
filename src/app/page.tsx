import { products } from '@/lib/products';
import ProductCard from '@/components/products/product-card';
import HeroSlider from '@/components/home/hero-slider';
import CategorySection from '@/components/home/category-section';
import ReviewsSection from '@/components/home/reviews-section';
import OnSaleSection from '@/components/home/on-sale-section';
import BestSellersSection from '@/components/home/best-sellers-section';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <CategorySection />
        <div className="mb-8 border-b pb-4">
          <h1 className="text-4xl font-bold tracking-tight">Featured Products</h1>
          <p className="mt-2 text-lg text-muted-foreground">Browse our collection of curated products.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <OnSaleSection />
        <BestSellersSection />
        <ReviewsSection />
      </div>
    </>
  );
}
