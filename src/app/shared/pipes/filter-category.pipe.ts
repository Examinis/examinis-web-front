import { Pipe, PipeTransform } from '@angular/core';
import { Question } from '../models/question';

@Pipe({
  name: 'filterCategory',
  standalone: true 
})
export class FilterCategoryPipe implements PipeTransform {
  transform(questions: Question[], selectedCategory: string): Question[] {
    if (!selectedCategory) return questions; 
    return questions.filter(q => q.categoria === selectedCategory);
  }
}
