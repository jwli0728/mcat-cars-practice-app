import { create } from 'zustand';
import { apiClient } from '../api/client';
import type { PassageWithQuestions, QuestionWithChoices } from '@mcat-app/shared';

interface SessionState {
  sessionId: number | null;
  passage: PassageWithQuestions | null;
  answers: Map<number, number>; // questionId -> selectedChoiceId
  flaggedQuestions: Set<number>;
  isLoading: boolean;
  error: string | null;

  // Actions
  startSession: (passageId: number, timedSession: boolean) => Promise<void>;
  selectAnswer: (questionId: number, choiceId: number) => Promise<void>;
  toggleFlag: (questionId: number) => Promise<void>;
  completeSession: (timeSpent?: number) => Promise<{ sessionId: number; score: number; totalQuestions: number }>;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessionId: null,
  passage: null,
  answers: new Map(),
  flaggedQuestions: new Set(),
  isLoading: false,
  error: null,

  startSession: async (passageId, timedSession) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.createSession({ passageId, timedSession });
      set({
        sessionId: response.session.id,
        passage: response.passage,
        answers: new Map(),
        flaggedQuestions: new Set(),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to start session',
        isLoading: false,
      });
      throw error;
    }
  },

  selectAnswer: async (questionId, choiceId) => {
    const { sessionId, answers } = get();
    if (!sessionId) return;

    try {
      await apiClient.submitAnswer(sessionId, {
        questionId,
        selectedChoiceId: choiceId,
      });

      const newAnswers = new Map(answers);
      newAnswers.set(questionId, choiceId);
      set({ answers: newAnswers });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to submit answer',
      });
    }
  },

  toggleFlag: async (questionId) => {
    const { sessionId, flaggedQuestions } = get();
    if (!sessionId) return;

    const newFlagged = new Set(flaggedQuestions);
    const isFlagged = newFlagged.has(questionId);

    try {
      await apiClient.submitAnswer(sessionId, {
        questionId,
        isFlagged: !isFlagged,
      });

      if (isFlagged) {
        newFlagged.delete(questionId);
      } else {
        newFlagged.add(questionId);
      }
      set({ flaggedQuestions: newFlagged });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to flag question',
      });
    }
  },

  completeSession: async (timeSpent) => {
    const { sessionId } = get();
    if (!sessionId) {
      throw new Error('No active session');
    }

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.completeSession(sessionId, timeSpent);
      set({ isLoading: false });
      return {
        sessionId,
        score: response.score,
        totalQuestions: response.totalQuestions,
      };
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to complete session',
        isLoading: false,
      });
      throw error;
    }
  },

  clearSession: () => {
    set({
      sessionId: null,
      passage: null,
      answers: new Map(),
      flaggedQuestions: new Set(),
      error: null,
    });
  },
}));
