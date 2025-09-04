import { Schema, model, Document, Types } from 'mongoose';
import type { IProductImage } from '../types/index.ts';

const productImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
);

export default model<IProductImage>('ProductImage', productImageSchema);
