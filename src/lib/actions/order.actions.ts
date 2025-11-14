
'use server';

import dbConnect from '../db';
import Order, { type IOrder, OrderItem, IOrderItem } from '@/models/Order';
import Product from '@/models/Product';
import { getUserFromSession } from './user.actions';
import Razorpay from 'razorpay';
import shortid from 'shortid';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

interface CreateOrderPayload {
    shippingAddress: {
        name: string;
        address: string;
        city: string;
        zip: string;
        email: string;
        phone: string;
    },
    items: {
        productId: string; // The parent Product ID
        quantity: number;
        price: number;
        variantSku?: string; // The specific variant SKU
    }[],
    totalAmount: number;
    originalAmount: number;
    discountAmount: number;
    couponCode?: string;
}

export async function createOrder(payload: CreateOrderPayload) {
    await dbConnect();
    const user = await getUserFromSession();

    if (!user) {
        throw new Error('You must be logged in to create an order.');
    }
    
    // Create OrderItems first
    const orderItems = await OrderItem.create(payload.items.map(item => ({
        product: item.productId, // Use the parent product ID for the ref
        quantity: item.quantity,
        price: item.price,
        variantSku: item.variantSku,
    })));

    const orderId = shortid.generate();

    const newOrder = new Order({
        orderId: orderId,
        user: user._id,
        items: orderItems.map(item => item._id),
        originalAmount: payload.originalAmount,
        discountAmount: payload.discountAmount,
        totalAmount: payload.totalAmount,
        couponCode: payload.couponCode,
        shippingAddress: payload.shippingAddress,
        status: 'Pending',
    });


    const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(payload.totalAmount * 100), // amount in the smallest currency unit
        currency: 'INR',
        receipt: orderId,
    });
    
    newOrder.razorpayOrderId = razorpayOrder.id;
    await newOrder.save();
    
    // Return both the razorpay order details and our internal order ID
    return {
        orderId: orderId,
        razorpayOrder: razorpayOrder
    };
}


export async function verifyPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}) {
    await dbConnect();
    
    const body = data.razorpay_order_id + "|" + data.razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex');
    
    const isVerified = expectedSignature === data.razorpay_signature;

    if (isVerified) {
        await Order.findOneAndUpdate(
            { razorpayOrderId: data.razorpay_order_id },
            {
                status: 'Paid',
                razorpayPaymentId: data.razorpay_payment_id,
                razorpaySignature: data.razorpay_signature,
            }
        );
    } else {
        await Order.findOneAndUpdate(
            { razorpayOrderId: data.razorpay_order_id },
            { status: 'Failed' }
        );
    }
    
    revalidatePath('/admin/orders');

    return { isVerified };
}

export async function getOrders(): Promise<IOrder[]> {
    await dbConnect();
    const orders = await Order.find({})
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(orders));
}

export async function getOrdersForUser(): Promise<IOrder[]> {
    await dbConnect();
    const user = await getUserFromSession();
    if (!user) {
        return [];
    }
    const orders = await Order.find({ user: user._id })
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(orders));
}


export async function getOrderById(id: string): Promise<IOrder | null> {
    await dbConnect();
    await Product.find({}); // Ensure product model is registered
    const order = await Order.findById(id)
        .populate('user', 'firstName lastName email')
        .populate({
            path: 'items',
            populate: {
                path: 'product',
                model: 'Product'
            }
        })
        .lean();
    
    if (!order) return null;
    return JSON.parse(JSON.stringify(order));
}

export async function updateOrderStatus(orderId: string, status: string) {
    await dbConnect();
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    order.status = status;
    await order.save();
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin/orders');
    revalidatePath(`/orders/${orderId}`);
    revalidatePath('/orders');
}
