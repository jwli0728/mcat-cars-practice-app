import { Hono } from 'hono';
import { SessionService } from '../services/session-service';
import { authMiddleware } from '../middleware/auth';
import { CreateSessionRequestSchema, SubmitAnswerRequestSchema } from '@mcat-app/shared';

const sessions = new Hono();

// All session routes require authentication
sessions.use('/*', authMiddleware);

// Create new practice session
sessions.post('/', async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const validatedData = CreateSessionRequestSchema.parse(body);

    const result = await SessionService.createSession(user.userId, validatedData);

    return c.json(result, 201);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: 'Failed to create session', message: error.message }, 400);
    }
    return c.json({ error: 'Failed to create session' }, 400);
  }
});

// Get session details
sessions.get('/:id', async (c) => {
  try {
    const user = c.get('user');
    const id = parseInt(c.req.param('id'));

    if (isNaN(id)) {
      return c.json({ error: 'Invalid session ID' }, 400);
    }

    const result = await SessionService.getSession(id, user.userId);
    return c.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Session not found') {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: 'Failed to fetch session', message: error.message }, 500);
    }
    return c.json({ error: 'Failed to fetch session' }, 500);
  }
});

// Submit/update answer for a question
sessions.patch('/:id/answer', async (c) => {
  try {
    const user = c.get('user');
    const id = parseInt(c.req.param('id'));

    if (isNaN(id)) {
      return c.json({ error: 'Invalid session ID' }, 400);
    }

    const body = await c.req.json();
    const validatedData = SubmitAnswerRequestSchema.parse(body);

    const answer = await SessionService.submitAnswer(id, user.userId, validatedData);

    return c.json({ answer });
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: 'Failed to submit answer', message: error.message }, 400);
    }
    return c.json({ error: 'Failed to submit answer' }, 400);
  }
});

// Complete session and calculate score
sessions.post('/:id/complete', async (c) => {
  try {
    const user = c.get('user');
    const id = parseInt(c.req.param('id'));

    if (isNaN(id)) {
      return c.json({ error: 'Invalid session ID' }, 400);
    }

    const body = await c.req.json();
    const timeSpent = body.timeSpent;

    const result = await SessionService.completeSession(id, user.userId, timeSpent);

    return c.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: 'Failed to complete session', message: error.message }, 400);
    }
    return c.json({ error: 'Failed to complete session' }, 400);
  }
});

// Get session results with explanations
sessions.get('/:id/results', async (c) => {
  try {
    const user = c.get('user');
    const id = parseInt(c.req.param('id'));

    if (isNaN(id)) {
      return c.json({ error: 'Invalid session ID' }, 400);
    }

    const results = await SessionService.getSessionResults(id, user.userId);

    return c.json(results);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Session not found') {
        return c.json({ error: error.message }, 404);
      }
      if (error.message === 'Session not yet completed') {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: 'Failed to fetch results', message: error.message }, 500);
    }
    return c.json({ error: 'Failed to fetch results' }, 500);
  }
});

export default sessions;
