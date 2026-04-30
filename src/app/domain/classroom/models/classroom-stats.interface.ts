export interface GlobalDifficulty {
  id: number;
  title: string;
  error_count: number;
}

export interface PlaylistSummary {
  id: number;
  title: string;
  question_count: number;
  avg_completion: number;
}

export interface StudentNeedingAttention {
  id: number;
  name: string;
  error_count: number;
}

export interface RecentSubmission {
  id: number;
  attempt_number: number;
  code: string;
  created_at: string;
  feedback: string;
  is_correct: boolean;
  question_id: number;
  socratic_hint: string;
  status: string;
  student_id: number;
  updated_at: string;
}

export interface ClassroomStats {
  student_count: number;
  question_count: number;
  playlist_count: number;
  avg_score: number;
  global_difficulties: GlobalDifficulty[];
  playlists_summary: PlaylistSummary[];
  students_needing_attention: StudentNeedingAttention[];
  recent_submissions: RecentSubmission[];
}
