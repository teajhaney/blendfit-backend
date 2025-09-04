import { Schema, model } from 'mongoose';
import type { IProduct } from '../types/index.ts';

const productSchema = new Schema<IProduct>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true, minlength: 10 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    gender: { type: Schema.Types.ObjectId, ref: 'Gender', required: true },
    images: [{ type: Schema.Types.ObjectId, ref: 'ProductImage' }],
    // reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  },
  { timestamps: true }
);

const Product = model<IProduct>('Product', productSchema);
export default Product;
