import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../interfaces/question';
import { environment } from '../../../environments/environment.development';

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
    return this.http.post<Question>(environment.apiUrl + '/question', question);
  }

}
