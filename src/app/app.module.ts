import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { QuestionListComponent } from '../app/question/list-question/list-question.component';
import { AppComponent } from './app.component';
import { CreateQuestionComponent } from './question/create-question/create-question.component';
import { FilterCategoryPipe } from './shared/pipes/filter-category.pipe';
import { QuestionService } from './shared/services/question.service';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CardModule,
    CommonModule,
    BrowserModule,  
    QuestionListComponent,
    FormsModule,
    AppComponent,
    FilterCategoryPipe,
    DropdownModule,
    ButtonModule,
    PanelModule,
    CreateQuestionComponent,
  ],
  providers: [
    QuestionService,
    
  ]
})
export class AppModule { }
