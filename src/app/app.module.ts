import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { QuestionListComponent } from '../app/question/list-question/list-question.component';  
import { QuestionService } from './shared/services/question.service';  
import { FormsModule } from '@angular/forms';
import { FilterCategoryPipe } from './shared/pipes/filter-category.pipe';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,  
    QuestionListComponent,
    FormsModule,
    AppComponent,
    FilterCategoryPipe
  ],
  providers: [
    QuestionService,
    
  ]
})
export class AppModule { }
