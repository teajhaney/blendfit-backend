import type { JwtPayload } from 'jsonwebtoken';
import { Document, Types } from 'mongoose';

export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  comparePassword(password: string): Promise<boolean>;
}

export interface TokenPayload extends JwtPayload {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Request {
  user?: string | JwtPayload;
}

//product
export interface Product extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  category: Types.ObjectId;
  brand: Types.ObjectId;
  gender: Types.ObjectId;
  images: Types.ObjectId[];
  reviews: Types.ObjectId[];
}

//produc
export interface Category extends Document {
  name: string;
}
//brand
export interface Brand extends Document {
  name: string;
}
//gender
export interface Gender extends Document {
  name: 'men' | 'women' | 'unisex';
}
//product image
export interface ProductImage extends Document {
  url: string;
  publicId: string;
  productId: Types.ObjectId;
}
//Review
export interface Review extends Document {
  rating: number;
  comment: string;
  userId: Types.ObjectId;
  productId: Types.ObjectId;
}

//cart
export interface Cart extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
}

//order
export interface Order extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  totalPrice: number;
  shippingAddress: object;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  quantity: number;
}
