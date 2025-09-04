import { Schema, model } from 'mongoose';
import type { IBrand } from '../types/index.ts';

const categorySchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      minlength: 2,
      trim: true,
    },
  },
  { timestamps: true }
);

const Brand = model<IBrand>('Brand', categorySchema);
export default Brand;
