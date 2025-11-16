
'use server';

import dbConnect from '../db';
import Order, { type IOrder, OrderItem, IOrderItem } from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { getUserFromSession } from './user.actions';
import Razorpay from 'razorpay';
import shortid from 'shortid';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

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
    saveAddress?: boolean;
}

export async function createOrder(payload: CreateOrderPayload) {
    await dbConnect();
    const token = cookies().get('session_token')?.value;
    let user = await getUserFromSession(token);

    const { shippingAddress, saveAddress } = payload;
    
    if (!user) {
      // Handle guest user
      const { email, name, phone } = shippingAddress;
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || firstName;
      
      let guestUser = await User.findOne({ $or: [{ email }, { phone }] });

      if (!guestUser) {
        guestUser = new User({
          email,
          phone,
          firstName,
          lastName,
          isGuest: true,
        });
        await guestUser.save();
      }
      user = guestUser;
    }

    if (user && !user.isGuest && saveAddress) {
        const dbUser = await User.findById(user._id);
        if (dbUser) {
            const addressExists = dbUser.addresses.some(
                (addr) =>
                addr.address === shippingAddress.address &&
                addr.zip === shippingAddress.zip
            );
            if (!addressExists) {
                if(dbUser.addresses.length === 0) {
                    (shippingAddress as any).isDefault = true;
                }
                dbUser.addresses.push(shippingAddress as any);
                await dbUser.save();
                revalidatePath('/profile');
            }
        }
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

    let order;
    if (isVerified) {
        order = await Order.findOneAndUpdate(
            { razorpayOrderId: data.razorpay_order_id },
            {
                status: 'Paid',
                razorpayPaymentId: data.razorpay_payment_id,
                razorpaySignature: data.razorpay_signature,
            },
            { new: true } // Return the updated document
        );
    } else {
        order = await Order.findOneAndUpdate(
            { razorpayOrderId: data.razorpay_order_id },
            { status: 'Failed' },
            { new: true }
        );
    }
    
    revalidatePath('/admin/orders');

    return { 
        isVerified,
        orderId: order?.orderId 
    };
}

export async function getOrders(): Promise<IOrder[]> {
    await dbConnect();
    await Product.find({}); // Ensure product model is registered
    const orders = await Order.find({})
      .populate('user', 'firstName lastName email')
      .populate({
        path: 'items',
        populate: {
          path: 'product',
          model: 'Product'
        }
      })
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(orders));
}

export async function getOrdersForUser(): Promise<IOrder[]> {
    await dbConnect();
    const token = cookies().get('session_token')?.value;
    const user = await getUserFromSession(token);
    if (!user) {
        return [];
    }
    const orders = await Order.find({ user: user._id })
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(orders));
}

export async function getOrdersByUserId(userId: string): Promise<IOrder[]> {
    await dbConnect();
    const orders = await Order.find({ user: userId })
        .populate('user', 'firstName lastName email')
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
