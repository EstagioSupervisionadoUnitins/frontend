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
  suspicion_score?: number;
  behavior_flags?: string[];
  paste_ratio?: number;
  annulled?: boolean;
  annulled_reason?: string;
  attempt_number?: number;
  student?: {
    id: number;
    name: string;
    email: string;
  };
}
