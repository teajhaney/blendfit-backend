import { model, Schema } from 'mongoose';
import type { IUser } from '../types/index.ts';
import * as argon2 from 'argon2';

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await argon2.hash(this.password.toString());
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  try {
    return await argon2.verify(this.password, password);
  } catch (error) {
    throw error;
  }
};

const User = model<IUser>('User', userSchema);
export default User;
