import jwt, { type JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.ts';
import type { User } from '../types/index.ts';

const generateToken = async (user: User) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const accessToken = jwt.sign(
    {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  return accessToken;
};

export default generateToken;
