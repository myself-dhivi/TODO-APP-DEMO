import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../services/todo.service';
import { ok, created, notFound } from '../utils/http';

export class TodoController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const todos = await TodoService.list(req.user!.id);
      return ok(res, todos);
    } catch (error) {
      return next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (!id) {
        return notFound(next, 'Invalid todo id');
      }
      const todo = await TodoService.get(req.user!.id, id);
      return ok(res, todo);
    } catch (error: any) {
      if (error.message === 'Todo not found') {
        return notFound(next, error.message);
      }
      return next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const todo = await TodoService.create(req.user!.id, req.body);
      return created(res, todo);
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const todo = await TodoService.update(req.user!.id, id, req.body);
      return ok(res, todo);
    } catch (error: any) {
      if (error.message === 'Todo not found') {
        return notFound(next, error.message);
      }
      return next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (!id) {
        return notFound(next, 'Invalid todo id');
      }
      const result = await TodoService.remove(req.user!.id, id);
      return ok(res, result);
    } catch (error: any) {
      if (error.message === 'Todo not found') {
        return notFound(next, error.message);
      }
      return next(error);
    }
  }
}