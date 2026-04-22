export interface Question {
  id: number;
  title: string;
  statement: string;
  difficulty: 'easy' | 'medium' | 'hard';
  constraints?: string;
}
