import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Difficulty } from '../interfaces/difficulty';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DifficultyApiService {

  private http: HttpClient = inject(HttpClient);
  
    constructor() { }
  
    /**
   * Get all difficulties
   * Makes an HTTP GET request to retrieve all difficulties from the API.
   * @returns {Observable<Difficulty[]>} An observable containing the list of difficulties.
   */
    getDifficulties(): Observable<Difficulty[]> {
      return this.http.get<Difficulty[]>(environment.apiUrl + '/difficulty');
    }
}
