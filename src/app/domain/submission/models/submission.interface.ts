export type SubmissionStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface Submission {
  id: number;
  question_id: number;
  code: string;
  status: SubmissionStatus;
  is_correct?: boolean;
  feedback?: string;
  socratic_hint?: string;
}
