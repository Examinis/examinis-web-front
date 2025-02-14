import { Difficulty } from './../models/difficulty';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ExamCreate } from '../interfaces/exam/exam-create';
import { Page } from '../interfaces/page';
import { Exam } from '../interfaces/exam';

@Injectable({
  providedIn: 'root'
})
export class ExamApiService {

  private http: HttpClient = inject(HttpClient);
  private readonly BASE_URL = environment.apiUrl + '/exams';

  constructor() { }

  /**
   * Get all exams with pagination
   * Makes an HTTP GET request to retrieve a paginated list of exams from the API.
   * @param {number} page - The page number to retrieve, defaults to 1.
   * @param {number} size - The number of exams per page, defaults to 10.
   * @returns {Observable<Page<Exam>>} An observable containing the paginated list of exams.
   */
  getExams(page: number = 1, size: number = 10): Observable<Page<Exam>> {
    return this.http.get<Page<Exam>>(`${this.BASE_URL}?page=${page}&size=${size}`);
  }

  /**
   * Get an exam by ID
   * Makes an HTTP GET request to retrieve a specific exam by its ID.
   * @param {number} id - The ID of the exam to retrieve.
   * @returns {Observable<Exam>} An observable containing the exam.
   */
  getExamById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.BASE_URL}/${id}`).pipe(
      map((exam: Exam) => this.convertToCamelCase(exam))
    );
  }

  /**
   * Create an exam automatically
   * Sends an exam to be automatically created by sending a POST request to the server.
   * @param {ExamCreate} exam - The exam data to be created.
   * @returns {Observable<ExamCreate>} An observable containing the created exam data.
   */
  createExamAutomatically(exam: ExamCreate): Observable<ExamCreate> {
    return this.http.post<ExamCreate>(`${this.BASE_URL}/automatic`, exam);
  }

  /**
   * Update an existing exam
   * Makes an HTTP PUT request to update an existing exam in the API.
   * @param {Exam} exam - The exam object to be updated.
   * @returns {Observable<Exam>} An observable containing the updated exam.
   */
  updateExam(exam: Exam): Observable<Exam> {
    return this.http.put<Exam>(`${this.BASE_URL}/${exam.id}`, exam);
  }

  /**
   * Delete an exam
   * Makes an HTTP DELETE request to remove an exam from the API.
   * @param {number} examId - The ID of the exam to delete.
   * @returns {Observable<void>}
   */
  deleteExam(examId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${examId}`);
  }

  /**
   * Converts an `Exam` object to a format with camelCase properties.
   * @param {Exam} exam - The exam object received from the API.
   * @returns {Exam} The converted exam object with camelCase properties.
   */
  private convertToCamelCase(exam: any): Exam {
    return {
      id: exam.id,
      title: exam.title,
      created_at: exam.created_at,
      user: exam.user || { id: 0, first_name: 'Não informado', last_name: '' },
      subject: exam.subject || { id: 0, name: 'Não informado' },
      total_question: exam.total_question
    };
  }
}
