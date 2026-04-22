export interface QuestionRequest {
  question: {
    title: string;
    statement: string;
    difficulty: 'easy' | 'medium' | 'hard';
    constraints?: string;
  };
}
