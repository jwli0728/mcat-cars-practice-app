import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// Import routes
import auth from './routes/auth';
import passages from './routes/passages';
import sessions from './routes/sessions';
import progress from './routes/progress';

const app = new Hono();

// Middleware
app.use('/*', logger());
app.use('/*', cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));

// Health check
app.get('/', (c) => {
  return c.json({
    message: 'MCAT CARS Practice API',
    version: '1.0.0',
    status: 'healthy'
  });
});

// API routes
app.route('/api/v1/auth', auth);
app.route('/api/v1/passages', passages);
app.route('/api/v1/sessions', sessions);
app.route('/api/v1/progress', progress);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found', message: 'The requested resource was not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json(
    { error: 'Internal Server Error', message: err.message },
    500
  );
});

const port = parseInt(process.env.PORT || '3000');

console.log(`🚀 Server starting on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
