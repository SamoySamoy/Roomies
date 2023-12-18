// Middleware to check if the request has a valid token
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: { email: string };
}

export const authToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }
  try {
    const decoded = jwt.verify(token, 'roomies') as { email: string };
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: 'Forbidden - Invalid token' });
  }
};
