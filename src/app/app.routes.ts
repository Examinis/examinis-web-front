import { Routes } from '@angular/router';
import { CreateQuestionComponent } from './question/create-question/create-question.component';
import { QuestionListComponent } from './question/list-question/list-question.component';
import { HomeComponent } from './home/home.component';
import { QuestionDetailsComponent } from './question/question-details/question-details.component';

export const routes: Routes = [
  {
    path: 'create-question',
    component: CreateQuestionComponent,
    title: 'Create a question',
  },
  {
    path: 'edit-question/:id',
    component: CreateQuestionComponent,
    title: 'Edit a question',
  },
  {
    path: 'list-question',
    component: QuestionListComponent,
    title: 'List questions',
  },
  {
    path: 'questions/:id',
    component: QuestionDetailsComponent,
    title: 'List questions',
  },
  {
    path: '**',
    component: HomeComponent,
    title: 'Home',
  },

];
