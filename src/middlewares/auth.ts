import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import { unauthorized } from '../utils/http';

type AppJwtPayload = JwtPayload & { userId: number }; // your custom field

declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return unauthorized(next, 'Authorization token required');
  }

  const token = auth.split(' ')[1];
  if (!token) {
    return unauthorized(next, 'Authorization token required');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET); // returns string | JwtPayload

    // Narrow the union and ensure our field exists
    if (typeof decoded === 'string' || !('userId' in decoded) || typeof decoded.userId !== 'number') {
      return unauthorized(next, 'Invalid token payload');
    }

    const payload = decoded as AppJwtPayload;
    req.user = { id: payload.userId };
    next();
  } catch {
    return unauthorized(next, 'Invalid or expired token');
  }
};
