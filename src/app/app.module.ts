import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { QuestionListComponent } from '../app/question/list-question/list-question.component';  
import { QuestionService } from './shared/services/question.service';  
import { FormsModule } from '@angular/forms';
import { FilterCategoryPipe } from './shared/pipes/filter-category.pipe';
import { AppComponent } from './app.component';

import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,  
    QuestionListComponent,
    FormsModule,
    AppComponent,
    FilterCategoryPipe,
    DropdownModule,
    ButtonModule,
    PanelModule
  ],
  providers: [
    QuestionService,
    
  ]
})
export class AppModule { }
