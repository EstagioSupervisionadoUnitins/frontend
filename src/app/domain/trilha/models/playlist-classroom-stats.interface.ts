export interface PlaylistOverview {
  id: number;
  title: string;
  question_count: number;
  started_count: number;
  finished_count: number;
  hardest_question?: {
    id: number;
    title: string;
    error_count: number;
  };
  avg_attempts?: number;
}

export interface PlaylistClassroomStats {
  classroom_id: number;
  playlists_overview: PlaylistOverview[];
}
