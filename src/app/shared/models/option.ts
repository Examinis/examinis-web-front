export class Option {
	id: number | undefined;
	description: string;
	letter: string;
	isCorrect: boolean;

	constructor(description: string, letter: string, isCorrect: boolean) {
		this.description = description;
		this.letter = letter;
		this.isCorrect = isCorrect;
	}
}
