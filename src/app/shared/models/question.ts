import { Difficulty } from "./difficulty";
import { Option } from "./option";
import { Subject } from "./subject";
import { User } from "./user";

export class Question {
  id: number | undefined;
  text: string;
  // image: string;
  subject: Subject;
  difficulty: Difficulty;
  user: User;
  options: Option[];

  constructor(text: string, subject: Subject, difficulty: Difficulty, user: User,
    options: Option[]
  ) {
    this.text = text;
    this.subject = subject;
    this.difficulty = difficulty;
    this.user = user;
    this.options = options;
  }
}
