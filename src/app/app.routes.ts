import { Routes } from '@angular/router';
import { CreateQuestionComponent } from './question/create-question/create-question.component';
import { QuestionListComponent } from './question/list-question/list-question.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: 'create-question',
    component: CreateQuestionComponent,
    title: 'Create a question',
  },
  {
    path: 'list-question',
    component: QuestionListComponent,
    title: 'List questions',
  },
  {
    path: '**',
    component: HomeComponent,
    title: 'Home',
  },

];
