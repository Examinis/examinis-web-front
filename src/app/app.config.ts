import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import Lara from '@primeng/themes/lara';
import { providePrimeNG } from 'primeng/config';

import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { AuthInterceptor } from './shared/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Manter a configuração HTTP original com fetch
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    
    // Adicionar o interceptor de autenticação
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    
    // Manter as demais configurações originais
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara,
      }
    }),
  ]
};



