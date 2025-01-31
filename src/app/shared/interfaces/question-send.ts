import { Option } from "../interfaces/option";

export interface QuestionSend {

  id?: number;
  text: string;
  subjectId: number;
  difficultyId: number;
  options: Option[];
}

// Criar um subtipo de QuestionSend que não tenha os campos id, subjectId e difficultyId
// export type QuestionTwo = Omit<QuestionSend, | 'id' | 'subjectId' | 'difficultyId'>;