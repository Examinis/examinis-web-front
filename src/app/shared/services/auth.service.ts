import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiError } from '../interfaces/user/api-error';
import { RegisterUser } from '../interfaces/user/register-user';
import { User } from '../interfaces/user/user';
import { Router } from '@angular/router';

// Novas interfaces para autenticação
export interface LoginRequest {
  username: string; // email do usuário
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly BASE_URL = environment.apiUrl;
  private readonly USER_STORAGE_KEY = 'examinisUser';
  private readonly TOKEN_KEY = 'examinisToken';
  
  // Login do usuário
  login(email: string, password: string): Observable<LoginResponse> {
    const loginData = new URLSearchParams();
    loginData.set('username', email);
    loginData.set('password', password);

    // const loginData: LoginRequest = {
    //   username: email, // A API espera 'username', mas o front usa 'email'
    //   password: password
    // };
    
    return this.http.post<LoginResponse>(
      `${this.BASE_URL}/auth`,
      loginData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).pipe(
        tap(response => {
          console.log(response);
          // Salvar o token no localStorage
          this.setToken(response);
        }),
        catchError(this.handleError)
      );
  }
  
  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  // Obtém o token armazenado
  getToken(): string | null {
    const tokenData = localStorage.getItem(this.TOKEN_KEY);
    if (!tokenData) return null;
    
    try {
      const parsedToken = JSON.parse(tokenData) as LoginResponse;
      return parsedToken.access_token;
    } catch (e) {
      this.logout(); // Se o token estiver corrompido, faz logout
      return null;
    }
  }
  
  // Armazena o token no localStorage
  private setToken(token: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
  }
  
  // Obtém o tipo de token (Bearer)
  getTokenType(): string {
    const tokenData = localStorage.getItem(this.TOKEN_KEY);
    if (!tokenData) return 'Bearer'; // Default
    
    try {
      const parsedToken = JSON.parse(tokenData) as LoginResponse;
      return parsedToken.token_type;
    } catch (e) {
      return 'Bearer'; // Default se houver erro
    }
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
      } else if (error.status === 401) {
        errorMessage = 'Email ou senha incorretos. Por favor, tente novamente.';
      } else {
        errorMessage = `Código de erro: ${error.status}, Mensagem: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
  
  // Método para logout
  logout(): void {
    localStorage.removeItem(this.USER_STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}