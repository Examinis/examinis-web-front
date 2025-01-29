import { Option } from "./option";

export class Question {
  id: number | null = null;
  text: string;
  // image: string;
  subjectId: number;
  difficultyId: number;
  // user: User;
  options: Option[];

  constructor(text: string, subjectId: number, difficultyId: number, options: Option[]
  ) {
    this.text = text;
    this.subjectId = subjectId;
    this.difficultyId = difficultyId;
    this.options = options;
  }
}
