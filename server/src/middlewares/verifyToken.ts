// Middleware to check if the request has a valid token
import { AuthenticatedRequest } from '@/lib/types';
import { createMsg, decodeToken } from '@/lib/utils';
import { Response, NextFunction } from 'express';

const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || (req.headers['Authorization'] as string);
  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json();
  }
  const decoded = decodeToken({
    type: 'accessToken',
    token,
  });
  if (!decoded) {
    return res.status(403).json(
      createMsg({
        type: 'invalid',
        invalidMessage: 'Forbidden - Invalid token',
      }),
    );
  }
  req.user = decoded;
  next();
};

export default verifyToken;
