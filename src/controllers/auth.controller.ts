import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ok, created, badRequest, unauthorized } from '../utils/http';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return created(res, result);
    } catch (error: any) {
      if (error.message === 'Email already in use') {
        return badRequest(next, error.message);
      }
      return next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      return ok(res, result);
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return unauthorized(next, error.message);
      }
      return next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getProfile(req.user!.id);
      return ok(res, user);
    } catch (error: any) {
      if (error.message === 'User not found') {
        return unauthorized(next, error.message);
      }
      return next(error);
    }
  }
}