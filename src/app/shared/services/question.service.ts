import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:3000/questoes';  // URL do JSON Server

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }
}