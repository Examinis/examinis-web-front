export interface Exam {
  id: number;
  title: string;
  created_at: string; // Data de criação (string)
  user: { // Professor criador
    id: number;
    first_name: string;
    last_name: string;
  };
  subject: { // Matéria (Disciplina)
    id: number;
    name: string;
  };
  total_question: number; // Quantidade de questões
}
