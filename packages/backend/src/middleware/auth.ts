import type { MiddlewareHandler } from 'hono';
import { AuthService } from '../services/auth-service';

export interface AuthContext {
  userId: number;
  email: string;
}

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized', message: 'Missing or invalid authorization header' }, 401);
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const payload = await AuthService.verifyToken(token);

    // Store user info in context for use in route handlers
    c.set('user', payload);

    await next();
  } catch (error) {
    return c.json({ error: 'Unauthorized', message: 'Invalid or expired token' }, 401);
  }
}
