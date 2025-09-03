import type { JwtPayload } from 'jsonwebtoken';
import { Document } from 'mongoose';

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
