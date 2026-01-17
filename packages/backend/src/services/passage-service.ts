import { db } from '../db/index';
import { passages, questions, answerChoices } from '../db/schema';
import { eq } from 'drizzle-orm';

export class PassageService {
  static async getAllPassages() {
    const allPassages = await db.select().from(passages);
    return allPassages;
  }

  static async getPassageById(passageId: number) {
    const [passage] = await db
      .select()
      .from(passages)
      .where(eq(passages.id, passageId))
      .limit(1);

    if (!passage) {
      throw new Error('Passage not found');
    }

    // Get all questions for this passage
    const passageQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.passageId, passageId))
      .orderBy(questions.questionNumber);

    // Get answer choices for each question
    const questionsWithChoices = await Promise.all(
      passageQuestions.map(async (question) => {
        const choices = await db
          .select()
          .from(answerChoices)
          .where(eq(answerChoices.questionId, question.id))
          .orderBy(answerChoices.choiceLetter);

        return {
          ...question,
          choices,
        };
      })
    );

    return {
      ...passage,
      questions: questionsWithChoices,
    };
  }
}
