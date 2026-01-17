import { Hono } from 'hono';
import '../types/hono'; // Import type extensions
import { PassageService } from '../services/passage-service';
import { authMiddleware } from '../middleware/auth';

const passages = new Hono();

// All passage routes require authentication
passages.use('/*', authMiddleware);

// Get all passages
passages.get('/', async (c) => {
  try {
    const allPassages = await PassageService.getAllPassages();
    return c.json({ passages: allPassages });
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: 'Failed to fetch passages', message: error.message }, 500);
    }
    return c.json({ error: 'Failed to fetch passages' }, 500);
  }
});

// Get single passage with questions
passages.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));

    if (isNaN(id)) {
      return c.json({ error: 'Invalid passage ID' }, 400);
    }

    const passage = await PassageService.getPassageById(id);
    return c.json({ passage });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Passage not found') {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: 'Failed to fetch passage', message: error.message }, 500);
    }
    return c.json({ error: 'Failed to fetch passage' }, 500);
  }
});

export default passages;
