import { Pipe, PipeTransform } from '@angular/core';
import { Question } from '../interfaces/question';
import { Subject } from '../interfaces/subject';

@Pipe({
  name: 'filterCategory',
  standalone: true 
})
export class FilterCategoryPipe implements PipeTransform {

  transform(questions: Question[], selectedSubject?: Subject): Question[] {
    if (!selectedSubject) return questions; 
    return questions.filter(question => question.subject === selectedSubject);
  }

}
