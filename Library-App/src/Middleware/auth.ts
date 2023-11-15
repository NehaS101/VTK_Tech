import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


interface AuthenticatedUser {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const authenticate = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).send('Access Denied');
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET || '') as AuthenticatedUser;
      req.user = verified;

      if (!roles.includes(req.user.role)) {
        return res.status(403).send('You do not have the required role.');
      }

      next();
    } catch (error) {
      res.status(400).send('Invalid Token');
    }
  };
};

export default authenticate;

