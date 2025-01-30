import { Difficulty } from "./difficulty";
import { Option } from "./option";
import { Subject } from "./subject";

export class Question {
  id: number | null = null;
  text: string;
  // image: string;
  subject: Subject;
  difficulty: Difficulty;
  // user: User;
  options: Option[];

  constructor(text: string, subject: Subject, difficulty: Subject, options: Option[]
  ) {
    this.text = text;
    this.subject = subject;
    this.difficulty = difficulty;
    this.options = options;
  }
}
