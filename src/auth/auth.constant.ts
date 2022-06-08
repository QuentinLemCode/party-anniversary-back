import { env } from 'process';

export const jwtConstants = {
  secret: env.JWT_SECRET || 'SECRET_KEY',
  expires_in: '180m',
};
