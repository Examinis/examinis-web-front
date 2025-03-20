import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { QuestionListComponent } from './question/list-question/list-question.component';
import { QuestionDetailsComponent } from './question/question-details/question-details.component';
import { CreateQuestionComponent } from './question/create-question/create-question.component';
import { ListExamComponent } from './exam/list-exam/list-exam.component';
import { CreateExamAutomaticComponent } from './exam/create-exam-automatic/create-exam-automatic.component';
import { CreateExamManualComponent } from './exam/create-exam-manual/create-exam-manual.component';
import { ShowExamComponent } from './exam/show-exam/show-exam.component';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
  // Rotas públicas (sem autenticação)
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
    path: 'login',
    component: LoginComponent,
    title: 'Login - Examinis'
  },
  
  // Rotas de exames - observe a ordem: específicas vêm primeiro
  {
    path: 'exams/create-automatic',
    component: CreateExamAutomaticComponent,
    title: 'Create automatic exam',
    canActivate: [authGuard]
  },
  {
    path: 'exams/create-manual',
    component: CreateExamManualComponent,
    title: 'Create manual exam',
    canActivate: [authGuard]
  },
  {
    path: 'exams/:id',
    component: ShowExamComponent,
    title: 'Detalhes da Prova',
  },
  {
    path: 'exams',
    component: ListExamComponent,
    title: 'List exams',
  },
  
  // Rotas de questões
  {
    path: 'questions/create',
    component: CreateQuestionComponent,
    title: 'Create a question',
    canActivate: [authGuard]
  },
  {
    path: 'questions/edit/:id',
    component: CreateQuestionComponent,
    title: 'Edit a question',
    canActivate: [authGuard]
  },
  {
    path: 'questions/:id',
    component: QuestionDetailsComponent,
    title: 'Question details',
    canActivate: [authGuard]
  },
  {
    path: 'questions',
    component: QuestionListComponent,
    title: 'List questions',
    canActivate: [authGuard]
  },
  
  // Rota para redirecionar URLs não reconhecidas
  {
    path: '**',
    redirectTo: '',
  },
];