import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ExamCreate } from '../interfaces/exam/exam-create';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamApiService {

  private http: HttpClient = inject(HttpClient);
  private readonly BASE_URL = environment.apiUrl + '/exams';

  /**
   * Sends an exam to be automatically created by sending a POST request to the server.
   *
   * @param {ExamCreate} exam - The exam data to be created.
   * @returns {Observable<ExamCreate>} An observable containing the created exam data.
   */
  createExamAutomatically(exam: ExamCreate): Observable<ExamCreate> {
    return this.http.post<ExamCreate>(`${this.BASE_URL}/automatic`, exam);
  }

  constructor() { }
}
