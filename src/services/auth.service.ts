import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}

export class AuthService {
  static async register({ name, email, password }: RegisterDto): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token
    };
  }

  static async login({ email, password }: LoginDto): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token
    };
  }

  static async getProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}