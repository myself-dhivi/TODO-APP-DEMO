import { prisma } from '../config/prisma';

export interface CreateTodoDto {
  title: string;
  completed?: boolean;
}

export interface UpdateTodoDto {
  title?: string;
  completed?: boolean;
}

export class TodoService {
  static async list(userId: number) {
    return await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async get(userId: number, id: number) {
    const todo = await prisma.todo.findFirst({
      where: { id, userId }
    });

    if (!todo) {
      throw new Error('Todo not found');
    }

    return todo;
  }

  static async create(userId: number, dto: CreateTodoDto) {
    return await prisma.todo.create({
      data: {
        title: dto.title,
        completed: dto.completed || false,
        userId
      }
    });
  }

  static async update(userId: number, id: number, dto: UpdateTodoDto) {
    // First check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: { id, userId }
    });

    if (!existingTodo) {
      throw new Error('Todo not found');
    }

    return await prisma.todo.update({
      where: { id },
      data: dto
    });
  }

  static async remove(userId: number, id: number) {
    // First check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findFirst({
      where: { id, userId }
    });

    if (!existingTodo) {
      throw new Error('Todo not found');
    }

    await prisma.todo.delete({
      where: { id }
    });

    return true;
  }
}