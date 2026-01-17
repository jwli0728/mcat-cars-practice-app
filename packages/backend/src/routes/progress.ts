import { Hono } from 'hono';
import { db } from '../db/index';
import { userProgress } from '../db/schema';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

const progress = new Hono();

// All progress routes require authentication
progress.use('/*', authMiddleware);

// Get user progress statistics
progress.get('/', async (c) => {
  try {
    const user = c.get('user');

    const [userProgressData] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, user.userId))
      .limit(1);

    if (!userProgressData) {
      // Return default progress if none exists yet
      return c.json({
        progress: {
          totalSessions: 0,
          totalQuestionsAnswered: 0,
          totalCorrect: 0,
          averageScore: 0,
          totalTimeSpent: 0,
          lastPracticeAt: null,
        },
      });
    }

    return c.json({ progress: userProgressData });
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: 'Failed to fetch progress', message: error.message }, 500);
    }
    return c.json({ error: 'Failed to fetch progress' }, 500);
  }
});

export default progress;
