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

  getQuestions(): Observable<Question> {
    return this.http.get<Question>(environment.apiUrl + '/question');
  }

}
