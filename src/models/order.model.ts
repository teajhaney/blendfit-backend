import { Schema, model } from 'mongoose';
import type { IOrder } from '../types/index.ts';

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: [
      { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    ],
    totalPrice: { type: Number, required: true, min: 0 },
    shippingAddress: {
      street: { type: String, required: true, minlength: 3 },
      city: { type: String, required: true, minlength: 2 },
      postalCode: { type: String, required: true, minlength: 4 },
      country: { type: String, required: true, minlength: 2 },
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const Order = model<IOrder>('Order', orderSchema);

export default Order;
