import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; 
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';  
import { appConfig } from './app/app.config';  

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  
    provideAnimations()   
  ]
}).catch(err => console.error(err));
bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
