
export class Option {
  id: number | null = null;
  // question: Question;
  description: string;
  letter: string;
  isCorrect: boolean;

  constructor(id: number, description: string, isCorrect: boolean, letter: string) {
    this.id = id;
    this.description = description;
    this.isCorrect = isCorrect;
    this.letter = letter;
  }
}
