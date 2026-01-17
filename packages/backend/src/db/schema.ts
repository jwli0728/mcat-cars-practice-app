import { pgTable, serial, varchar, text, integer, boolean, timestamp, decimal, unique } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Passages table
export const passages = pgTable('passages', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  estimatedTime: integer('estimated_time').notNull(), // in seconds
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Questions table
export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  passageId: integer('passage_id').notNull().references(() => passages.id, { onDelete: 'cascade' }),
  questionNumber: integer('question_number').notNull(),
  questionText: text('question_text').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Answer Choices table
export const answerChoices = pgTable('answer_choices', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  choiceLetter: varchar('choice_letter', { length: 1 }).notNull(),
  choiceText: text('choice_text').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  explanation: text('explanation').notNull(),
});

// Practice Sessions table
export const practiceSessions = pgTable('practice_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  passageId: integer('passage_id').notNull().references(() => passages.id),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  timedSession: boolean('timed_session').notNull(),
  timeSpent: integer('time_spent'), // in seconds
  score: integer('score'),
  totalQuestions: integer('total_questions').notNull(),
});

// Session Answers table
export const sessionAnswers = pgTable('session_answers', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').notNull().references(() => practiceSessions.id, { onDelete: 'cascade' }),
  questionId: integer('question_id').notNull().references(() => questions.id),
  selectedChoiceId: integer('selected_choice_id').references(() => answerChoices.id),
  isFlagged: boolean('is_flagged').notNull().default(false),
  isCorrect: boolean('is_correct'),
  answeredAt: timestamp('answered_at'),
});

// User Progress table
export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  totalSessions: integer('total_sessions').notNull().default(0),
  totalQuestionsAnswered: integer('total_questions_answered').notNull().default(0),
  totalCorrect: integer('total_correct').notNull().default(0),
  averageScore: decimal('average_score', { precision: 5, scale: 2 }).notNull().default('0'),
  totalTimeSpent: integer('total_time_spent').notNull().default(0), // in seconds
  lastPracticeAt: timestamp('last_practice_at'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
