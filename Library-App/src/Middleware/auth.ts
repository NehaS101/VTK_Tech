import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../Model/usermodel';
import dotenv from 'dotenv';
dotenv.config();

interface AuthenticatedUser {
  id: string;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      user: AuthenticatedUser;
    }
  }
}

const verifyToken = (token: string): AuthenticatedUser | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || '') as AuthenticatedUser;
  } catch (error) {
    return null;
  }
};

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).send('Access Denied');
  }

  const decodedUser = verifyToken(token);

  if (!decodedUser) {
    return res.status(400).send('Invalid Token');
  }

  try {
    const user = await User.findById(decodedUser.id);

    if (!user) {
      return res.status(400).send('User not found');
    }

    req.user = {
      id: user._id,
      roles: user.roles,
    };

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

export default authenticate;



