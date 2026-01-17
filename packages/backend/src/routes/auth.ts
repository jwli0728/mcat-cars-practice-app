import { Hono } from 'hono';
import '../types/hono'; // Import type extensions
import { AuthService } from '../services/auth-service';
import { authMiddleware } from '../middleware/auth';
import { SignupRequestSchema, LoginRequestSchema } from '@mcat-app/shared';

const auth = new Hono();

// Signup
auth.post('/signup', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = SignupRequestSchema.parse(body);

    const result = await AuthService.signup(validatedData);

    return c.json(result, 201);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: 'Signup failed', message: error.message }, 400);
    }
    return c.json({ error: 'Signup failed' }, 400);
  }
});

// Login
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = LoginRequestSchema.parse(body);

    const result = await AuthService.login(validatedData);

    return c.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: 'Login failed', message: error.message }, 401);
    }
    return c.json({ error: 'Login failed' }, 401);
  }
});

// Get current user
auth.get('/me', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const userData = await AuthService.getUserById(user.userId);

    return c.json({ user: userData });
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: 'Failed to get user', message: error.message }, 404);
    }
    return c.json({ error: 'Failed to get user' }, 404);
  }
});

export default auth;
