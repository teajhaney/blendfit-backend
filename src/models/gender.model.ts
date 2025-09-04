import { Schema, model } from 'mongoose';
import type { IGender } from '../types/index.ts';

const genderSchema = new Schema<IGender>(
  {
    gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
  },
  { timestamps: true }
);

const Gender = model<IGender>('Gender', genderSchema);

export default Gender;
