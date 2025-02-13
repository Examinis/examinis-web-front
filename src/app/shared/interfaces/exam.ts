export interface Exam {
  id: number;
  title: string;
  instructions: string; // Enunciado da prova
  created_at: string; // Data de criação (string)
  updated_at: string; // Data de atualização (string)
  user: { // Professor criador
    id: number;
    first_name: string;
    last_name: string;
  };
  subject: { // Matéria (Disciplina)
    id: number;
    name: string;
  };
  questions: { // Lista de questões
    id: number;
    text: string;
    options: {
      id: number;
      description: string;
      letter: string;
    }[];
  }[];
}
