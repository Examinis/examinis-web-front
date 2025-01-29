import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionApiService {

  private http: HttpClient = inject(HttpClient);

  constructor() { }

  /**
   * Get all questions
   * Makes an HTTP GET request to retrieve all questions from the API.
   * @returns {Observable<Question[]>} An observable containing the list of questions.
   */
  getQuestions(): Observable<Question> {
    return this.http.get<Question>(environment.apiUrl + '/question');
  }

  /**
   * Create a new question
   * Makes an HTTP POST request to create a new question.
   * @param {Question} question - The question to create.
   * @returns {Observable<Question>} An observable containing the created question.
   */
  createQuestion(question: Question): Observable<Question> {
    const payload = this.convertToSnakeCase(question);
    return this.http.post<Question>(environment.apiUrl + '/question', payload);
  }

  private convertToSnakeCase(question: Question): Object {
    return {
      text: question.text,
      subject_id: question.subjectId,
      difficulty_id: question.difficultyId,
      options: question.options.map(option => ({
        description: option.description,
        letter: option.letter,
        is_correct: option.isCorrect
      }))
    }

  }

}
