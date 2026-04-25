import { Question } from './question.interface';

export interface QuestionUpdate {
  question: Partial<Omit<Question, 'id' | 'classroom_id'>>;
}
