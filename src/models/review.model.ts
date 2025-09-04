import { Schema, model, Document, Types } from 'mongoose';
import type { IReview } from '../types/index.ts';

const reviewSchema = new Schema<IReview>(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
);

export default model<IReview>('Review', reviewSchema);
