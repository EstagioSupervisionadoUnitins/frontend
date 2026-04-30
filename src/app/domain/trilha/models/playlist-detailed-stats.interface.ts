export interface UserQuestionDetail {
  question_id: number;
  question_title: string;
  attempts: number;
  status: 'solved' | 'pending' | 'not_started';
}

export interface UserPlaylistStat {
  id: number;
  name: string;
  correct_questions: number;
  total_questions: number;
  incorrect_attempts: number;
  completion_percentage: number;
  details_per_question: UserQuestionDetail[];
}

export interface QuestionStat {
  id: number;
  title: string;
  solved_by_count: number;
  pending_count: number;
  total_errors: number;
  avg_attempts_to_solve: number;
}

export interface HardestQuestion {
  id: number;
  title: string;
  solved_by_count: number;
  pending_count: number;
  total_errors: number;
  avg_attempts_to_solve: number;
}

export interface PlaylistDetailedStats {
  playlist_id: number;
  playlist_title?: string;
  user_stats: UserPlaylistStat[];
  question_stats: QuestionStat[];
  insights: {
    hardest_questions: HardestQuestion[];
  };
}
