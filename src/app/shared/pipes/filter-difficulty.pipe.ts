import { Pipe, PipeTransform } from '@angular/core';
import { Question } from '../models/question';

@Pipe({
  name: 'filterDifficulty',
  standalone: true
})
export class FilterDifficultyPipe implements PipeTransform {
  transform(questions: Question[], selectedDifficulty: string): Question[] {
    if (!selectedDifficulty) return questions; 
    return questions.filter(q => q.dificuldade === selectedDifficulty); 
  }
}
