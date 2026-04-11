export type StatusModulo = 'concluido' | 'em_andamento' | 'bloqueado';

export interface Aula {
  titulo: string;
  tipo: 'video' | 'exercicio' | 'leitura';
  concluida: boolean;
}

export interface Modulo {
  id: number;
  titulo: string;
  descricao: string;
  status: StatusModulo;
  aulas: Aula[];
}
