export interface Exam {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  subjectId?: number;
  difficultyId?: number;
  numQuestions?: number;
  subject: { id: number; name: string }; // Matéria (Disciplina)
}

