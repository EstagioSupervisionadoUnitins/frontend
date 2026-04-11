export interface FeedbackIA {
  sucesso: boolean;
  mensagem: string;
  dicas?: string[];
}

export interface ExercicioDetalhe {
  id: number;
  titulo: string;
  descricao: string;
  codigoBase: string;
  linguagem: string;
}
