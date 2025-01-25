import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../interfaces/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionApiService {
 
  private http: HttpClient = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:8000/api' ;  // TODO : Add the URL to an environment variable

  constructor() { }

  getQuestions(): Observable<Question> {
    return this.http.get<Question>(this.BASE_URL + '/questions');
  }

}
