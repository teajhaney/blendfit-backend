import { Types } from 'mongoose';
import { z } from 'zod';

export const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).optional(),
});

export const signinSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

//zod schema for product validation
export const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  //   sku: z.string().min(5),
  category: z.string().refine(val => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  }),
  brand: z.string().refine(val => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  }),
  gender: z.string().refine(val => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  }),
  images: z
    .array(
      z.string().refine(val => Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      })
    )
    .optional(),
  reviews: z
    .array(
      z.string().refine(val => Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      })
    )
    .optional(),
});

// Zod schema for category validation
export const categorySchema = z.object({
  name: z.string().min(2, 'Category must be at least 2 characters'),
});
export const bulkCategorySchema = z.object({
  categories: z
    .array(categorySchema)
    .min(1, { message: 'At least one category is required' }),
});

// Zod schema for brand validation
export const brandSchema = z.object({
  name: z.string().min(2, 'Brand must be at least 2 characters'),
});

export const bulkBrandSchema = z.object({
  brands: z
    .array(brandSchema)
    .min(1, { message: 'At least one brand is required' }),
});

// Zod schema for gender validation
export const genderSchema = z.object({
  gender: z.enum(['men', 'women', 'unisex']),
});

// Zod schema for product image validation
export const productImageSchema = z.object({
  url: z.url(),
  publicId: z.string().min(1),
  productId: z.string().refine(val => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  }),
  userId: z.string().refine(val => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  }),
});

// Zod schema for review validation
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  productId: z.string().refine(val => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  }),
});

// Zod schema for cart validation
export const cartSchema = z.object({
  productId: z.string().refine(val => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
  }),
  quantity: z.number().positive(),
});

// Zod schema for order validation
export const orderSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(3, 'Street must be at least 3 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    postalCode: z.string().min(4, 'Postal code must be at least 4 characters'),
    country: z.string().min(2, 'Country must be at least 2 characters'),
  }),
  status: z
    .enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .optional(),
});
