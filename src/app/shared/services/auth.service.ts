import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiError } from '../interfaces/user/api-error';
import { RegisterUser } from '../interfaces/user/register-user';
import { User } from '../interfaces/user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly BASE_URL = environment.apiUrl;
  private readonly USER_STORAGE_KEY = 'examinisUser';
  
  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    return localStorage.getItem(this.USER_STORAGE_KEY) !== null;
  }
  
  // Obtém o usuário atual armazenado localmente
  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.USER_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  }
  
  // Registra um novo usuário
  register(userData: RegisterUser): Observable<User> {
    // Criamos um FormData para enviar o arquivo junto com os outros dados
    const formData = new FormData();
    formData.append('first_name', userData.first_name);
    formData.append('last_name', userData.last_name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    if (userData.institution) {
      formData.append('institution', userData.institution);
    }
    
    formData.append('identity_proof', userData.identity_proof);
    
    return this.http.post<User>(`${this.BASE_URL}/user`, formData)
      .pipe(
        tap(response => {
          // Armazena dados básicos do usuário após registro bem-sucedido
          localStorage.setItem(
            'registeredUser', 
            JSON.stringify({
              id: response.id,
              first_name: response.firstName,
              last_name: response.lastName
            })
          );
        }),
        catchError(this.handleError)
      );
  }
  
  // Método para lidar com erros da API
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro na comunicação com o servidor';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro retornado pelo servidor
      if (error.status === 422 && error.error?.detail) {
        // Erro de validação da API
        const apiError = error.error as ApiError;
        const errorDetails = apiError.detail.map(err => 
          `${err.msg} (${err.loc.join('.')})`
        ).join('; ');
        
        errorMessage = `Erro de validação: ${errorDetails}`;
      } else {
        errorMessage = `Código de erro: ${error.status}, Mensagem: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
  
  // Método para logout
  logout(): void {
    localStorage.removeItem(this.USER_STORAGE_KEY);
  }
}