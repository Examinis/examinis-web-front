import { Question } from "./question";

export class Option {
  id: number;
  question: Question;
  description: string;
  letter: string;
  isCorrect: boolean;

  constructor(id: number, question: Question, description: string, isCorrect: boolean, letter: string) {
    this.id = id;
    this.question = question;
    this.description = description;
    this.isCorrect = isCorrect;
    this.letter = letter;
  }
}
