import { Pipe, PipeTransform } from '@angular/core';
import { Question } from '../interfaces/question';
import { Difficulty } from '../interfaces/difficulty';

@Pipe({
  name: 'filterDifficulty',
  standalone: true
})
export class FilterDifficultyPipe implements PipeTransform {
  
  transform(questions: Question[], selectedDifficulty?: Difficulty): Question[] {
    if (!selectedDifficulty) return questions; 
    return questions.filter(question => question.difficulty === selectedDifficulty); 
  }

}
