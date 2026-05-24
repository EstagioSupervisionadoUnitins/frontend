export interface ClassroomStudentStats {
  total_submissions: number;
  correct_submissions: number;
  completed_playlists_count: number;
  total_playlists_count: number;
  suspicious_submissions_count: number;
}

export interface ClassroomStudent {
  id: number;
  name: string;
  email: string;
  score?: number;
  enrolled_at?: string;
  stats?: ClassroomStudentStats;
}
