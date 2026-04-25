export interface Classroom {
  id: number;
  name: string;
  code: string;
  teacher_id: number;
  description?: string;
  teacher_name?: string;
  stats?: {
    total_students: number;
    total_questions: number;
    total_submissions: number;
    average_score: number;
  };
}
