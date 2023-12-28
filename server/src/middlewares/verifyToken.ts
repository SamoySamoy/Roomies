// Middleware to check if the request has a valid token
import { AuthenticatedRequest, AccessTokenPayload } from '@/lib/types';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || (req.headers['Authorization'] as string);
  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Forbidden - Invalid token' });
    }
    req.user = decoded as AccessTokenPayload;
    next();
  });
};

export default verifyToken;
