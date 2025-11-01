export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageHint: string;
};

export type CartItem = {
  id: string;
  quantity: number;
} & Product;

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
