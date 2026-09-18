import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key_please_change',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
} as const;
