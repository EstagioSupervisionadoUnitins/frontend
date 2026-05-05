export type SubmissionStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface Submission {
  id: number;
  question_id?: number;
  question?: {
    id: number;
    title: string;
    statement?: string;
    difficulty?: string;
    constraints?: string;
  };
  code: string;
  status: SubmissionStatus;
  is_correct?: boolean;
  feedback?: string;
  socratic_hint?: string;
  created_at?: string;
}
