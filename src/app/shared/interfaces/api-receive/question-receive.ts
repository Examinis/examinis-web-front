import { Difficulty } from "../difficulty";
import { Subject } from "../subject";
import { OptionReceive } from "./option-receive";
import { UserReceive } from "./user-receive";

export interface QuestionReceive {
  id?: number;
  // snake_case for API compatibility
  text: string;
  subject: Subject;
  difficulty: Difficulty;
  created_at?: Date;
  user?: UserReceive;
  options: OptionReceive[];
}