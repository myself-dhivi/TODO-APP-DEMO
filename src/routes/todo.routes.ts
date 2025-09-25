import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';
import { authenticate } from '../middlewares/auth';
import { validate, todoCreateSchema, todoUpdateSchema, todoParamsSchema } from '../middlewares/validate';

const router = Router();

// All routes are protected
router.use(authenticate);

router.get('/', TodoController.list);
router.post('/', validate(todoCreateSchema), TodoController.create);
router.get('/:id', validate(todoParamsSchema), TodoController.get);
router.patch('/:id', validate(todoUpdateSchema), TodoController.update);
router.delete('/:id', validate(todoParamsSchema), TodoController.remove);

export { router as todoRoutes };