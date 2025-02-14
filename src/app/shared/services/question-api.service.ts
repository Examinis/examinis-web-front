import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { QuestionReceive } from '../interfaces/api-receive/question-receive';
import { Page } from '../interfaces/page';
import { Question } from '../interfaces/question';
import { QuestionSend } from '../interfaces/question-send';

@Injectable({
  providedIn: 'root'
})
export class QuestionApiService {

  private http: HttpClient = inject(HttpClient);
  private readonly BASE_URL = environment.apiUrl + '/questions';

  constructor() { }

  /**
   * Get all questions with pagination
   * Makes an HTTP GET request to retrieve a paginated list of questions from the API.
   * @param {number} page - The page number to retrieve, defaults to 1.
   * @param {number} size - The number of questions per page, defaults to 10.
   * @returns {Observable<Page<Question>>} An observable containing the paginated list of questions.
   */
  getQuestions(page: number = 1, size: number = 10): Observable<Page<Question>> {
    return this.http.get<Page<Question>>(this.BASE_URL + `?page=${page}&size=${size}`);
  }

  /**
   * Get a question by ID
   * Makes an HTTP GET request to retrieve a specific question by its ID.
   * @param {number} id - The ID of the question to retrieve.
   * @returns {Observable<Question>} An observable containing the question.
   */
  getQuestionById(id: number): Observable<Question> {
    return this.http.get<QuestionReceive>(`${this.BASE_URL}/${id}`).pipe(
      map((question: QuestionReceive) => this.convertToCamelCase(question)));
  }

  /**
   * Create a new question
   * Makes an HTTP POST request to create a new question.
   * @param {QuestionSend} question - The question to create.
   * @returns {Observable<QuestionSend>} An observable containing the created question.
   */
  createQuestion(question: QuestionSend): Observable<QuestionSend> {
    const payload = this.convertToSnakeCase(question);
    return this.http.post<QuestionSend>(this.BASE_URL, payload);
  }

  /**
   * Update an existing question
   * Makes an HTTP PUT request to update an existing question in the API.
   * @param {QuestionSend} question - The question object to be updated.
   * @returns {Observable<QuestionSend>} An observable containing the updated question.
   */
  updateQuestion(question: QuestionSend): Observable<QuestionSend> {
    const payload = this.convertToSnakeCase(question);
    return this.http.put<QuestionSend>(`${this.BASE_URL}`, payload);
  }

  /**
   * Delete question
   * @param {number} questionId
   * @returns {Observable<void>}
   */
  deleteQuestion(questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${questionId}`);
  }

  /**
   * Convert a question object to snake_case format
   * Transforms a Question object to an object with snake_case keys, suitable for API requests.
   * @param {Question} question - The question object to convert.
   * @returns {Object} An object with snake_case keys representing the question.
   */
  private convertToSnakeCase(question: QuestionSend): Object {
    return {
      id: question.id,
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

  /**
   * Converts a `QuestionReceive` object to a `Question` object with camelCase properties.
   *
   * @param {QuestionReceive} question - The question object received from the API.
   * @returns {Question} The converted question object with camelCase properties.
   */
  private convertToCamelCase(question: QuestionReceive): Question {
    return {
      id: question.id,
      text: question.text,
      subject: question.subject,
      difficulty: question.difficulty,
      createdAt: question.created_at,
      user: question.user && {
        id: question.user?.id,
        firstName: question.user?.first_name,
        lastName: question.user?.last_name
      },
      options: question.options.map(option => ({
        description: option.description,
        letter: option.letter,
        isCorrect: option.is_correct
      }))
    }
  }

}
