import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Não adicione o token para as rotas de autenticação e registro
    if (request.url.endsWith('/auth') || request.url.endsWith('/user/create')) {
      return next.handle(request);
    }
    
    const token = this.authService.getToken();
    
    if (token) {
      const tokenType = this.authService.getTokenType();
      
      // Clonar a requisição e adicionar o token no header
      const authReq = request.clone({
        setHeaders: {
          Authorization: `${tokenType} ${token}`
        }
      });
      
      return next.handle(authReq);
    }
    
    return next.handle(request);
  }
}