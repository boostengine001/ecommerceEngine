import { products } from './products';
import type { Product } from './types';

export interface OrderItem extends Product {
    quantity: number;
}

export type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    zip: string;
  };
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled';
  date: string;
};

export const orders: Order[] = [
  {
    id: 'ORD001',
    customer: {
      name: 'Olivia Martin',
      email: 'olivia.martin@email.com',
    },
    shippingAddress: {
        address: '123 Main St',
        city: 'San Francisco',
        zip: '94105'
    },
    items: [
      { ...products[6], quantity: 1 }, // Sky-Explorer V2
    ],
    total: 499.99,
    status: 'Shipped',
    date: '2024-07-20',
  },
  {
    id: 'ORD002',
    customer: {
      name: 'Jackson Lee',
      email: 'jackson.lee@email.com',
    },
     shippingAddress: {
        address: '456 Oak Ave',
        city: 'New York',
        zip: '10001'
    },
    items: [
      { ...products[3], quantity: 1 }, // The Voyager
    ],
    total: 129.99,
    status: 'Processing',
    date: '2024-07-21',
  },
  {
    id: 'ORD003',
    customer: {
      name: 'Isabella Nguyen',
      email: 'isabella.nguyen@email.com',
    },
     shippingAddress: {
        address: '789 Pine Ln',
        city: 'Los Angeles',
        zip: '90012'
    },
    items: [
      { ...products[5], quantity: 1 }, // Ortho-Comfort+
      { ...products[1], quantity: 1 }, // SoundScape Pro
    ],
    total: 579.98,
    status: 'Shipped',
    date: '2024-07-21',
  },
  {
    id: 'ORD004',
    customer: {
      name: 'William Kim',
      email: 'will@email.com',
    },
     shippingAddress: {
        address: '101 Maple Dr',
        city: 'Chicago',
        zip: '60607'
    },
    items: [
      { ...products[2], quantity: 2 }, // EchoSphere
    ],
    total: 179.98,
    status: 'Delivered',
    date: '2024-07-18',
  },
  {
    id: 'ORD005',
    customer: {
      name: 'Sofia Davis',
      email: 'sofia.davis@email.com',
    },
     shippingAddress: {
        address: '212 Birch Rd',
        city: 'Houston',
        zip: '77002'
    },
    items: [
      { ...products[7], quantity: 1 }, // Velocity Runners
      { ...products[0], quantity: 1 }, // Azure Timepiece
    ],
    total: 369.98,
    status: 'Pending',
    date: '2024-07-22',
  },
];

export const getOrderById = (id: string): Order | undefined => {
  return orders.find(o => o.id === id);
};
