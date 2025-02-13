import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ExamAutomaticCreate } from '../interfaces/exam/exam-create';
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
   * @param {ExamAutomaticCreate} exam - The exam data to be created.
   * @returns {Observable<ExamAutomaticCreate>} An observable containing the created exam data.
   */
  createExamAutomatically(exam: ExamAutomaticCreate): Observable<ExamAutomaticCreate> {
    return this.http.post<ExamAutomaticCreate>(`${this.BASE_URL}/automatic`, exam);
  }

  constructor() { }
}
