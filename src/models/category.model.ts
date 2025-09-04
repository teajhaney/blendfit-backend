import { Schema, model } from 'mongoose';
import type { ICategory } from '../types/index.ts';

const categorySchema = new Schema<ICategory>(
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

const Category = model<ICategory>('Category', categorySchema);
export default Category;
