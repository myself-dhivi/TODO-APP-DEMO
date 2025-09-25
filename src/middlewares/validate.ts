import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { badRequest } from '../utils/http';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      
      req.body = validated.body;
      req.params = validated.params;
      req.query = validated.query;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        return badRequest(next, `Validation error: ${message}`);
      }
      return badRequest(next, 'Validation error');
    }
  };
};

// Validation schemas
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  })
});

export const todoCreateSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    completed: z.boolean().optional(),
  })
});

export const todoUpdateSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title must not be empty').optional(),
    completed: z.boolean().optional(),
  }).refine(data => data.title !== undefined || data.completed !== undefined, {
    message: "At least one field (title or completed) must be provided"
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid todo ID').transform(Number),
  })
});

export const todoParamsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid todo ID').transform(Number),
  })
});