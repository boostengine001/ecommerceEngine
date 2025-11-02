import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const productDetails = [
  { id: 'blue-watch', name: 'Azure Timepiece', description: 'A beautifully crafted watch with a deep blue face and a stainless steel strap. Perfect for any occasion.', price: 249.99, category: 'fashion' },
  { id: 'wireless-headphones', name: 'SoundScape Pro', description: 'Immerse yourself in high-fidelity audio with these noise-cancelling wireless headphones. 30-hour battery life.', price: 179.99, salePrice: 149.99, category: 'electronics' },
  { id: 'smart-speaker', name: 'EchoSphere', description: 'Your personal AI assistant, ready to play music, answer questions, and control your smart home. Rich, room-filling sound.', price: 89.99, category: 'electronics' },
  { id: 'leather-backpack', name: 'The Voyager', description: 'A durable and stylish backpack made from genuine leather. Features multiple compartments and a padded laptop sleeve.', price: 129.99, category: 'fashion' },
  { id: 'coffee-maker', name: 'Morning BrewMaster', description: 'Start your day right with the perfect cup of coffee. This programmable machine offers various brew strengths.', price: 79.99, salePrice: 64.99, category: 'home' },
  { id: 'ergonomic-chair', name: 'Ortho-Comfort+', description: 'Support your posture during long work hours with this fully adjustable ergonomic office chair. Breathable mesh back.', price: 399.99, category: 'home' },
  { id: 'drone-camera', name: 'Sky-Explorer V2', description: 'Capture stunning 4K aerial footage with this easy-to-fly drone. Features a 3-axis gimbal and intelligent flight modes.', price: 499.99, salePrice: 449.99, category: 'electronics' },
  { id: 'running-shoes', name: 'Velocity Runners', description: 'Lightweight and responsive running shoes designed for speed and comfort. Ideal for road running and marathons.', price: 119.99, category: 'fashion' }
];

export const products: Product[] = productDetails.map(detail => {
  const placeholder = PlaceHolderImages.find(p => p.id === detail.id);
  if (!placeholder) {
    throw new Error(`Placeholder image not found for product id: ${detail.id}`);
  }
  return {
    ...detail,
    image: placeholder.imageUrl,
    imageHint: placeholder.imageHint
  };
});

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};
