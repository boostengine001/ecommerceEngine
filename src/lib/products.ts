
import type { Product, ProductMedia } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { IProduct } from '@/models/Product';
import { getProducts } from './actions/product.actions';


type ProductData = Omit<Product, 'media'> & { mediaIds: string[] };

const productDetails: ProductData[] = [
  { 
    id: 'blue-watch', 
    name: 'Azure Timepiece', 
    description: 'A beautifully crafted watch with a deep blue face and a stainless steel strap. Perfect for any occasion.', 
    price: 249.99, 
    category: 'fashion',
    mediaIds: ['blue-watch', 'blue-watch-2', 'blue-watch-3'],
    highlights: [
      'Swiss quartz movement',
      'Sapphire crystal glass',
      'Water-resistant up to 50m',
      '2-year international warranty'
    ],
    specifications: {
      'Case Material': 'Stainless Steel',
      'Strap Material': 'Stainless Steel',
      'Case Diameter': '42mm',
      'Movement': 'Swiss Quartz',
    }
  },
  { 
    id: 'wireless-headphones', 
    name: 'SoundScape Pro', 
    description: 'Immerse yourself in high-fidelity audio with these noise-cancelling wireless headphones. 30-hour battery life.', 
    price: 179.99, 
    salePrice: 149.99, 
    category: 'electronics',
    mediaIds: ['wireless-headphones', 'wireless-headphones-2', 'wireless-headphones-3'],
    highlights: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Bluetooth 5.2 connectivity',
      'Comfortable over-ear design'
    ],
    specifications: {
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      'Connectivity': 'Bluetooth 5.2, 3.5mm jack',
      'Weight': '250g'
    }
  },
  { 
    id: 'smart-speaker', 
    name: 'EchoSphere', 
    description: 'Your personal AI assistant, ready to play music, answer questions, and control your smart home. Rich, room-filling sound.', 
    price: 89.99, 
    category: 'electronics',
    mediaIds: ['smart-speaker', 'smart-speaker-2', 'smart-speaker-3'],
    highlights: [
      'Voice-controlled AI assistant',
      '360-degree sound',
      'Multi-room audio',
      'Smart home integration'
    ],
    specifications: {
        'Connectivity': 'Wi-Fi, Bluetooth',
        'Dimensions': '5.7" x 3.9"',
        'Power': 'AC Adapter'
    }
  },
  { 
    id: 'leather-backpack', 
    name: 'The Voyager', 
    description: 'A durable and stylish backpack made from genuine leather. Features multiple compartments and a padded laptop sleeve.', 
    price: 129.99, 
    category: 'fashion',
    mediaIds: ['leather-backpack', 'leather-backpack-2', 'leather-backpack-3'],
    highlights: [
        'Genuine full-grain leather',
        'Padded 15" laptop sleeve',
        'Multiple interior pockets',
        'Comfortable shoulder straps'
    ],
    specifications: {
        'Material': 'Full-grain leather',
        'Dimensions': '18" x 12" x 6"',
        'Capacity': '20L'
    }
  },
  { 
    id: 'coffee-maker', 
    name: 'Morning BrewMaster', 
    description: 'Start your day right with the perfect cup of coffee. This programmable machine offers various brew strengths.', 
    price: 79.99, 
    salePrice: 64.99, 
    category: 'home',
    mediaIds: ['coffee-maker', 'coffee-maker-2', 'coffee-maker-3'],
     highlights: [
        'Programmable 24-hour timer',
        'Adjustable brew strength',
        '12-cup glass carafe',
        'Pause and serve function'
    ],
    specifications: {
        'Capacity': '12 cups',
        'Material': 'Stainless Steel & Plastic',
        'Filter': 'Reusable mesh filter'
    }
  },
  { 
    id: 'ergonomic-chair', 
    name: 'Ortho-Comfort+', 
    description: 'Support your posture during long work hours with this fully adjustable ergonomic office chair. Breathable mesh back.', 
    price: 399.99, 
    category: 'home',
    mediaIds: ['ergonomic-chair', 'ergonomic-chair-2', 'ergonomic-chair-3'],
    highlights: [
        'Adjustable lumbar support',
        '4D adjustable armrests',
        'Breathable mesh back',
        'Recline and tilt lock'
    ],
    specifications: {
        'Material': 'Mesh, Aluminum, Foam',
        'Weight Capacity': '300 lbs',
        'Adjustments': 'Height, Armrests, Lumbar, Tilt'
    }
  },
  { 
    id: 'drone-camera', 
    name: 'Sky-Explorer V2', 
    description: 'Capture stunning 4K aerial footage with this easy-to-fly drone. Features a 3-axis gimbal and intelligent flight modes.', 
    price: 499.99, 
    salePrice: 449.99, 
    category: 'electronics',
    mediaIds: ['drone-camera', 'drone-camera-2', 'drone-camera-3'],
    highlights: [
        '4K video at 30fps',
        '3-axis gimbal stabilization',
        '30-minute flight time',
        'Intelligent flight modes (Follow Me, Orbit)'
    ],
    specifications: {
        'Max Flight Time': '30 minutes',
        'Video Resolution': '4K UHD',
        'Range': '5 km',
        'Weight': '570g'
    }
  },
  { 
    id: 'running-shoes', 
    name: 'Velocity Runners', 
    description: 'Lightweight and responsive running shoes designed for speed and comfort. Ideal for road running and marathons.', 
    price: 119.99,
    category: 'fashion',
    mediaIds: ['running-shoes', 'running-shoes-2', 'running-shoes-3'],
     highlights: [
        'Ultra-lightweight foam midsole',
        'Breathable engineered mesh upper',
        'Durable rubber outsole for traction',
        '8mm heel-to-toe drop'
    ],
    specifications: {
        'Type': 'Neutral',
        'Weight': '8.5 oz (Men\'s size 9)',
        'Use': 'Road Running, Racing',
    }
  }
];

// Helper function to create the full Product object with media
function createProduct(productData: ProductData): Product {
    const media = productData.mediaIds.map(id => {
      const placeholder = PlaceHolderImages.find(p => p.id === id);
      if (!placeholder) {
        throw new Error(`Placeholder image not found for id: ${id}`);
      }
      return { 
        type: 'image' as 'image' | 'video', 
        url: placeholder.imageUrl, 
        alt: placeholder.description,
        imageHint: placeholder.imageHint,
      };
    });

    const mainImagePlaceholder = PlaceHolderImages.find(p => p.id === productData.mediaIds[0]);
    if (!mainImagePlaceholder) {
        throw new Error(`Main placeholder image not found for id: ${productData.mediaIds[0]}`);
    }

    return {
        ...productData,
        image: mainImagePlaceholder.imageUrl,
        imageHint: mainImagePlaceholder.imageHint,
        media
    };
}


export const products: Product[] = productDetails.map(createProduct);

export function getProductById(id: string): Product | undefined {
    return products.find(p => p.id === id);
}
