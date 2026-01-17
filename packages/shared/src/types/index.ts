import { z } from "zod";

// User types
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Passage types
export const PassageSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  category: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  estimatedTime: z.number(), // in seconds
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Passage = z.infer<typeof PassageSchema>;

// Question types
export const QuestionSchema = z.object({
  id: z.number(),
  passageId: z.number(),
  questionNumber: z.number(),
  questionText: z.string(),
  createdAt: z.date(),
});

export type Question = z.infer<typeof QuestionSchema>;

// Answer Choice types
export const AnswerChoiceSchema = z.object({
  id: z.number(),
  questionId: z.number(),
  choiceLetter: z.enum(["A", "B", "C", "D"]),
  choiceText: z.string(),
  isCorrect: z.boolean(),
  explanation: z.string(),
});

export type AnswerChoice = z.infer<typeof AnswerChoiceSchema>;

// Practice Session types
export const PracticeSessionSchema = z.object({
  id: z.number(),
  userId: z.number(),
  passageId: z.number(),
  startedAt: z.date(),
  completedAt: z.date().nullable(),
  timedSession: z.boolean(),
  timeSpent: z.number().nullable(), // in seconds
  score: z.number().nullable(),
  totalQuestions: z.number(),
});

export type PracticeSession = z.infer<typeof PracticeSessionSchema>;

// Session Answer types
export const SessionAnswerSchema = z.object({
  id: z.number(),
  sessionId: z.number(),
  questionId: z.number(),
  selectedChoiceId: z.number().nullable(),
  isFlagged: z.boolean(),
  isCorrect: z.boolean().nullable(),
  answeredAt: z.date().nullable(),
});

export type SessionAnswer = z.infer<typeof SessionAnswerSchema>;

// User Progress types
export const UserProgressSchema = z.object({
  id: z.number(),
  userId: z.number(),
  totalSessions: z.number(),
  totalQuestionsAnswered: z.number(),
  totalCorrect: z.number(),
  averageScore: z.number(),
  totalTimeSpent: z.number(), // in seconds
  lastPracticeAt: z.date().nullable(),
  updatedAt: z.date(),
});

export type UserProgress = z.infer<typeof UserProgressSchema>;

// API Request/Response types

// Auth
export const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export type SignupRequest = z.infer<typeof SignupRequestSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const AuthResponseSchema = z.object({
  user: UserSchema.omit({ createdAt: true, updatedAt: true }),
  token: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Session Creation
export const CreateSessionRequestSchema = z.object({
  passageId: z.number(),
  timedSession: z.boolean(),
});

export type CreateSessionRequest = z.infer<typeof CreateSessionRequestSchema>;

// Submit Answer
export const SubmitAnswerRequestSchema = z.object({
  questionId: z.number(),
  selectedChoiceId: z.number().optional(),
  isFlagged: z.boolean().optional(),
});

export type SubmitAnswerRequest = z.infer<typeof SubmitAnswerRequestSchema>;

// Question with Choices (for display)
export interface QuestionWithChoices extends Question {
  choices: AnswerChoice[];
}

// Passage with Questions (for practice session)
export interface PassageWithQuestions extends Passage {
  questions: QuestionWithChoices[];
}

// Session Results
export interface QuestionResult {
  question: Question;
  userAnswer: AnswerChoice | null;
  correctAnswer: AnswerChoice;
  isCorrect: boolean;
  isFlagged: boolean;
  allChoices: AnswerChoice[];
}

export const SessionResultsSchema = z.object({
  session: PracticeSessionSchema,
  score: z.number(),
  totalQuestions: z.number(),
  timeSpent: z.number().nullable(),
  questions: z.array(z.any()), // QuestionResult[], using any for complex nested type
});

export type SessionResults = z.infer<typeof SessionResultsSchema>;

// API Error Response
export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
