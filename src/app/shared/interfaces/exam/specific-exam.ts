export interface SpecificExam {
  id: number;
  title: string;
  instructions: string;
  created_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
  subject: {
    id: number;
    name: string;
  };
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export interface Option {
  id: number;
  description: string;
  letter: string;
  is_correct: boolean;
}