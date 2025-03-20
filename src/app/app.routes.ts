import { Routes } from '@angular/router';
import { CreateQuestionComponent } from './question/create-question/create-question.component';
import { QuestionListComponent } from './question/list-question/list-question.component';
import { HomeComponent } from './home/home.component';
import { QuestionDetailsComponent } from './question/question-details/question-details.component';
import { ListExamComponent } from './exam/list-exam/list-exam.component';
import { CreateExamAutomaticComponent } from './exam/create-exam-automatic/create-exam-automatic.component';
import { CreateExamManualComponent } from './exam/create-exam-manual/create-exam-manual.component';
import { ShowExamComponent } from './exam/show-exam/show-exam.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  {
    path: 'questions/create',
    component: CreateQuestionComponent,
    title: 'Create a question',
  },
  {
    path: 'questions/edit/:id',
    component: CreateQuestionComponent,
    title: 'Edit a question',
  },
  {
    path: 'questions',
    component: QuestionListComponent,
    title: 'List questions',
  },
  {
    path: 'questions/:id',
    component: QuestionDetailsComponent,
    title: 'Question details',
  },
  {
    path: 'exams',
    component: ListExamComponent,
    title: 'List exams',
  },
  {
    path: 'exams/create-automatic',
    component: CreateExamAutomaticComponent,
    title: 'Create automatic exam',
  },
  {
    path: 'exams/create-manual',
    component: CreateExamManualComponent,
    title: 'Create manual exam',
  },
  {
    path: 'exams/:id',
    component: ShowExamComponent,
    title: 'Detalhes da Prova',
  },
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Cadastro - Examinis'
  },
  {
    path: '**',
    redirectTo: '',
  },
];