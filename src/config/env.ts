// src/config/env.ts
import 'dotenv/config';
import type { Secret, SignOptions } from 'jsonwebtoken';

interface EnvConfig {
  DATABASE_URL: string;
  JWT_SECRET: Secret;                           // <- strong type
  JWT_EXPIRES_IN: SignOptions['expiresIn'];     // <- string | number
  PORT: number;
}

const required = (name: string): string => {
  const v = process.env[name];
  if (!v) throw new Error(`Environment variable ${name} is required`);
  return v;
};

export const env: EnvConfig = {
  DATABASE_URL: required('DATABASE_URL'),
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'],
  PORT: parseInt(process.env.PORT ?? '3000', 10),
};
