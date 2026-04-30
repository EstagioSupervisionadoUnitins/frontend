import { Question } from '../../question/models/question.interface';

export interface Playlist {
  id: number;
  title: string;
  description: string;
  classroom_id: number;
  questions: Question[];
}

// Campo calculado no frontend para status da trilha
export type PlaylistStatus = 'concluida' | 'em_andamento' | 'bloqueada' | 'nao_iniciada';
