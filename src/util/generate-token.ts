import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.ts';
import type { User } from '../types/index.ts';

// interface TokenPayload {
//   userId: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

const generateToken = async (user: any) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  return accessToken;
};

export default generateToken;
