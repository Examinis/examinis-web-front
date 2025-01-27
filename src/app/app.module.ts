import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { QuestionListComponent } from '../app/question/list-question/list-question.component';  
import { QuestionService } from './shared/services/question.service';  

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,  
    QuestionListComponent,  
  ],
  providers: [
    QuestionService,
    
  ]
})
export class AppModule { }
