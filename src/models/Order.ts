
import mongoose, { Schema, Document, models, model, Types } from 'mongoose';
import { IUser } from './User';
import { IProduct } from './Product';

export interface IOrderItem extends Document {
  product: Types.ObjectId | IProduct;
  quantity: number;
  price: number; // Price at the time of purchase
  variantSku?: string;
}

export interface IOrder extends Document {
  _id: string;
  orderId: string; // User-friendly order ID
  user: Types.ObjectId | IUser;
  items: (Types.ObjectId | IOrderItem)[];
  totalAmount: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zip: string;
    email: string;
    phone: string;
  };
  status: 'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  variantSku: { type: String },
});

const ShippingAddressSchema: Schema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
}, { _id: false });

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }],
  totalAmount: { type: Number, required: true },
  shippingAddress: { type: ShippingAddressSchema, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Failed'], 
    default: 'Pending' 
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
}, { timestamps: true });


export const OrderItem = models.OrderItem || model<IOrderItem>('OrderItem', OrderItemSchema);
export default models.Order || model<IOrder>('Order', OrderSchema);
