import { Schema, model } from 'mongoose';
import type { ICart } from '../types/index.ts';

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const Cart = model<ICart>('Cart', cartSchema);
export default Cart;
