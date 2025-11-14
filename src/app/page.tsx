import HeroSlider from '@/components/home/hero-slider';
import CategorySection from '@/components/home/category-section';
import FeaturedProductsSection from '@/components/home/featured-products-section';
import ReviewsSection from '@/components/home/reviews-section';

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <CategorySection />
        <FeaturedProductsSection />
        <ReviewsSection />
      </div>
    </div>
  );
}
