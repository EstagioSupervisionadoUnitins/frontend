import { Classroom } from '../../classroom/models/classroom.interface';

export interface UserStats {
  total_submissions: number;
  correct_submissions: number;
  total_score: number;
  questions_attempted: number;
  questions_solved: number;
  current_streak: number;
  username: string;
  email: string;
  role: string;
  classroom: Classroom;
}
