import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Subject } from '../interfaces/subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectApiService {

  private http: HttpClient = inject(HttpClient);

  constructor() { }

  /**
 * Get all subjects
 * Makes an HTTP GET request to retrieve all subjects from the API.
 * @returns {Observable<Subject[]>} An observable containing the list of subjects.
 */
  getSubjects() {
    return this.http.get<Subject[]>(environment.apiUrl + '/subject');
  }
}
