import { db } from '../db/index';
import { practiceSessions, sessionAnswers, questions, answerChoices, userProgress } from '../db/schema';
import { eq, and, isNotNull } from 'drizzle-orm';
import type { CreateSessionRequest, SubmitAnswerRequest } from '@mcat-app/shared';
import { PassageService } from './passage-service';

export class SessionService {
  static async createSession(userId: number, data: CreateSessionRequest) {
    // Verify passage exists
    await PassageService.getPassageById(data.passageId);

    // Count questions in passage
    const passageQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.passageId, data.passageId));

    const totalQuestions = passageQuestions.length;

    // Create practice session
    const [session] = await db
      .insert(practiceSessions)
      .values({
        userId,
        passageId: data.passageId,
        timedSession: data.timedSession,
        totalQuestions,
      })
      .returning();

    // Create session answer records for each question
    await Promise.all(
      passageQuestions.map((question) =>
        db.insert(sessionAnswers).values({
          sessionId: session.id,
          questionId: question.id,
          isFlagged: false,
        })
      )
    );

    // Get full passage with questions
    const passage = await PassageService.getPassageById(data.passageId);

    return {
      session,
      passage,
    };
  }

  static async getSession(sessionId: number, userId: number) {
    const [session] = await db
      .select()
      .from(practiceSessions)
      .where(
        and(
          eq(practiceSessions.id, sessionId),
          eq(practiceSessions.userId, userId)
        )
      )
      .limit(1);

    if (!session) {
      throw new Error('Session not found');
    }

    const passage = await PassageService.getPassageById(session.passageId);

    const answers = await db
      .select()
      .from(sessionAnswers)
      .where(eq(sessionAnswers.sessionId, sessionId));

    return {
      session,
      passage,
      answers,
    };
  }

  static async submitAnswer(sessionId: number, userId: number, data: SubmitAnswerRequest) {
    // Verify session belongs to user
    const [session] = await db
      .select()
      .from(practiceSessions)
      .where(
        and(
          eq(practiceSessions.id, sessionId),
          eq(practiceSessions.userId, userId)
        )
      )
      .limit(1);

    if (!session) {
      throw new Error('Session not found');
    }

    if (session.completedAt) {
      throw new Error('Session already completed');
    }

    // Find the session answer record
    const [existingAnswer] = await db
      .select()
      .from(sessionAnswers)
      .where(
        and(
          eq(sessionAnswers.sessionId, sessionId),
          eq(sessionAnswers.questionId, data.questionId)
        )
      )
      .limit(1);

    if (!existingAnswer) {
      throw new Error('Question not found in session');
    }

    // Update the answer
    const updateData: any = {
      answeredAt: new Date(),
    };

    if (data.selectedChoiceId !== undefined) {
      updateData.selectedChoiceId = data.selectedChoiceId;

      // Check if answer is correct
      const [choice] = await db
        .select()
        .from(answerChoices)
        .where(eq(answerChoices.id, data.selectedChoiceId))
        .limit(1);

      if (choice) {
        updateData.isCorrect = choice.isCorrect;
      }
    }

    if (data.isFlagged !== undefined) {
      updateData.isFlagged = data.isFlagged;
    }

    const [updatedAnswer] = await db
      .update(sessionAnswers)
      .set(updateData)
      .where(eq(sessionAnswers.id, existingAnswer.id))
      .returning();

    return updatedAnswer;
  }

  static async completeSession(sessionId: number, userId: number, timeSpent?: number) {
    // Verify session belongs to user
    const [session] = await db
      .select()
      .from(practiceSessions)
      .where(
        and(
          eq(practiceSessions.id, sessionId),
          eq(practiceSessions.userId, userId)
        )
      )
      .limit(1);

    if (!session) {
      throw new Error('Session not found');
    }

    if (session.completedAt) {
      throw new Error('Session already completed');
    }

    // Calculate score
    const answers = await db
      .select()
      .from(sessionAnswers)
      .where(eq(sessionAnswers.sessionId, sessionId));

    const correctCount = answers.filter((a) => a.isCorrect === true).length;

    // Update session
    const [updatedSession] = await db
      .update(practiceSessions)
      .set({
        completedAt: new Date(),
        score: correctCount,
        timeSpent: timeSpent || null,
      })
      .where(eq(practiceSessions.id, sessionId))
      .returning();

    // Update user progress
    await this.updateUserProgress(userId);

    return {
      session: updatedSession,
      score: correctCount,
      totalQuestions: session.totalQuestions,
    };
  }

  static async getSessionResults(sessionId: number, userId: number) {
    const { session, passage, answers } = await this.getSession(sessionId, userId);

    if (!session.completedAt) {
      throw new Error('Session not yet completed');
    }

    // Build detailed results with explanations
    const questionResults = await Promise.all(
      passage.questions.map(async (q) => {
        const answer = answers.find((a) => a.questionId === q.id);
        const userAnswer = answer?.selectedChoiceId
          ? q.choices.find((c) => c.id === answer.selectedChoiceId) || null
          : null;
        const correctAnswer = q.choices.find((c) => c.isCorrect)!;

        return {
          question: q,
          userAnswer,
          correctAnswer,
          isCorrect: answer?.isCorrect || false,
          isFlagged: answer?.isFlagged || false,
          allChoices: q.choices,
        };
      })
    );

    return {
      session,
      score: session.score || 0,
      totalQuestions: session.totalQuestions,
      timeSpent: session.timeSpent,
      questions: questionResults,
    };
  }

  private static async updateUserProgress(userId: number) {
    // Get all completed sessions for user
    const completedSessions = await db
      .select()
      .from(practiceSessions)
      .where(
        and(
          eq(practiceSessions.userId, userId),
          isNotNull(practiceSessions.completedAt)
        )
      );

    const totalSessions = completedSessions.length;
    const totalQuestionsAnswered = completedSessions.reduce(
      (sum, s) => sum + (s.totalQuestions || 0),
      0
    );
    const totalCorrect = completedSessions.reduce((sum, s) => sum + (s.score || 0), 0);
    const averageScore =
      totalQuestionsAnswered > 0
        ? (totalCorrect / totalQuestionsAnswered) * 100
        : 0;
    const totalTimeSpent = completedSessions.reduce(
      (sum, s) => sum + (s.timeSpent || 0),
      0
    );

    const lastSession = completedSessions[completedSessions.length - 1];
    const lastPracticeAt = lastSession?.completedAt || null;

    // Update or insert user progress
    const [existing] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .limit(1);

    if (existing) {
      await db
        .update(userProgress)
        .set({
          totalSessions,
          totalQuestionsAnswered,
          totalCorrect,
          averageScore: averageScore.toFixed(2),
          totalTimeSpent,
          lastPracticeAt,
          updatedAt: new Date(),
        })
        .where(eq(userProgress.userId, userId));
    } else {
      await db.insert(userProgress).values({
        userId,
        totalSessions,
        totalQuestionsAnswered,
        totalCorrect,
        averageScore: averageScore.toFixed(2),
        totalTimeSpent,
        lastPracticeAt,
      });
    }
  }
}
