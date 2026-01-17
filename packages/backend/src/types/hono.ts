import type { AuthContext } from '../middleware/auth';

// Extend Hono's context variables
declare module 'hono' {
  interface ContextVariableMap {
    user: AuthContext;
  }
}
