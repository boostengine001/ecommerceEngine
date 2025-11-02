export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  imageHint: string;
  category: string;
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

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  shippingAddress?: string;
  billingAddress?: string;
};

export type Review = {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    title: string;
    comment: string;
};

export type Category = {
  id: string;
  name: string;
  href: string;
  image: string;
  imageHint: string;
  subcategories: {
    id: string;
    name: string;
    href: string;
  }[];
};
