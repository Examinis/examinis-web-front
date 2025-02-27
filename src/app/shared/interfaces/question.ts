import { Subject } from "./subject";
import { Difficulty } from "./difficulty";
import { User } from "./user";
import { Option } from "./option";

export interface Question {
  id?: number;
  text: string;
  subject: Subject;
  difficulty: Difficulty;
  createdAt?: Date;
  user?: User;
  options: Option[];
}
