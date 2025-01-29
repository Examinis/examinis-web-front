import { Routes } from '@angular/router';
import { CreateQuestionComponent } from './question/create-question/create-question.component';

export const routes: Routes = [
  {
    path: 'create-question',
    component: CreateQuestionComponent,
    title: 'Create a question',
  },
  { path: '', redirectTo: '/create-question', pathMatch: 'full' }, // redirect to `create-question`

];
