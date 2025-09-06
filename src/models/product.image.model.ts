import { Schema, model, Document, Types } from 'mongoose';
import type { IProductImage } from '../types/index.ts';

const productImageSchema = new Schema<IProductImage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
);
const Media = model<IProductImage>('ProductImage', productImageSchema);

export default Media;
