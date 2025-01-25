import { Subject } from "./subject";
import { Difficulty } from "./difficulty";
import { User } from "./user";
import { Option } from "./option";

export interface Question {
  id: number | undefined;
  text: string;
  subject: Subject;
  difficulty: Difficulty;
  user: User;
  options: Option[];
}
