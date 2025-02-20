import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of, tap } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { SidebarDrawerComponent } from '../../shared/components/sidebar-drawer/sidebar-drawer.component';

import { QuestionApiService } from '../../shared/services/question-api.service';
import { SubjectApiService } from '../../shared/services/subject-api.service';

import { CreateExamDialogComponent } from '../../exam/create-exam-dialog/create-exam-dialog.component';
import { Difficulty } from '../../shared/interfaces/difficulty';
import { Page } from '../../shared/interfaces/page';
import { QuestionList } from '../../shared/interfaces/question';
import { Subject } from '../../shared/interfaces/subject';


import { Router, RouterModule } from '@angular/router';
import { ExamManualCreate } from '../../shared/interfaces/exam/exam-create';
import { ExamApiService } from '../../shared/services/exam-api.service';


@Component({
  selector: 'app-question-list',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.css'],
  providers: [ConfirmationService, MessageService],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    PaginatorModule,
    SelectModule,
    ConfirmDialogModule,
    ButtonModule,
    ToastModule,
    RouterModule,
    SidebarDrawerComponent,
    CreateExamDialogComponent,
  ],
})
export class QuestionListComponent implements OnInit {
  
  private questionApiService = inject(QuestionApiService);
  private subjectApiService = inject(SubjectApiService);
  private examApiService: ExamApiService = inject(ExamApiService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private router: Router = inject(Router);

  readonly MAX_QUESTIONS = 20;
  readonly MIN_QUESTIONS = 5;

  questions: Page<QuestionList> = { total: 0, page: 1, size: 10, results: [] };
  examToBeCreated: ExamManualCreate = { title: '', instructions: '', subject_id: 0, questions: [] };

  subjects: Subject[] = [];
  selectedSubject?: Subject;

  difficulties: Difficulty[] = [
    { id: 1, name: 'Fácil' },
    { id: 2, name: 'Médio' },
    { id: 3, name: 'Difícil' },
  ];
  selectedDifficulty?: Difficulty;
  
  sidebarVisible?: boolean;
  createExamDialogVisible: boolean = false;
  isSelectingQuestions: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  trackByQuestionId(item: any): number {
    return item.id;
  }

  loadData(page: number = 1, size: number = this.questions.size): void {
    forkJoin({
      subjects: this.subjectApiService.getSubjects().pipe(
        catchError(() => of([]))
      ),
      questions: this.questionApiService.getQuestions(page, size).pipe(
        catchError(() => of({ total: 0, page: 1, size: 10, results: [] }))
      ),
    }).subscribe({
      next: ({ subjects, questions }) => {
        this.subjects = subjects;
        this.questions = {
          ...questions,
          results: questions.results || [],
        };
      },
      error: (error) => console.error('Error in forkJoin', error),
    });
  }
 
  showCreateExamDialog() {
    this.createExamDialogVisible = true;
  }

  closeCreateExamDialog() {
    this.createExamDialogVisible = false;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.questionApiService.getFilteredQuestions(this.questions.page, this.questions.size,
      this.selectedSubject?.id, this.selectedDifficulty?.id
    ).subscribe({
      next: (questions) => {
        this.questions = { ...questions };
        this.questions.results.forEach((question) => console.log(question));
      },
      error: () => console.error("Algo deu errado durante a filtragem de questões.")
    });
  }

  onPageChange(event: any): void {
    this.questionApiService.getFilteredQuestions(event.page + 1, event.rows,
      this.selectedSubject?.id, this.selectedDifficulty?.id
    ).subscribe({
      next: (questions) => this.questions = { ...questions },
      error: () => console.error("Algo deu errado durante a mudança de página.")
    });
  }

  viewQuestion(id?: number): void {
    if (!id) { return; }
    this.router.navigate(['questions', id]);
  }

  editQuestion(id?: number): void {
    if (!id) { return; }
    this.router.navigate(['edit-question', id]);
  }

  deleteQuestion(questionId: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja excluir esta questão?',
      header: 'Atenção!',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        // Chama o serviço para excluir a questão
        this.questionApiService.deleteQuestion(questionId).pipe(
          tap(() => {
            // Recarrega as questões após a exclusão
            this.loadData();
            // Exibe a mensagem de sucesso
            this.messageService.add({
              severity: 'success',
              summary: 'Excluído',
              detail: 'Questão excluída com sucesso.',
            });
          }),
          catchError((error) => {
            console.error('Erro ao deletar a questão', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Ocorreu um erro ao excluir a questão.',
            });
            return of([]);
          })
        ).subscribe();
      },
      reject: () => {
        // Mensagem de cancelamento
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Exclusão cancelada.',
        });
      },
    });
  }

  confirmExamManualCreation() {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja criar a prova?',
      header: 'Atenção!',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.createExam();
      },
      reject: () => {
        this.messageService.add(
          { severity: 'info', summary: 'Cancelado', detail: 'Criação de exame cancelada.' });
      },
    });
  }

  handleDialogSubmitted(examData: ExamManualCreate): void {
    this.examToBeCreated = examData;
    console.log('Exam to be created: ', this.examToBeCreated);
  }

  handleChooseQuestionsPressed(selectedSubject: Subject) {
    this.selectedSubject = selectedSubject;
    this.isSelectingQuestions = true;
    this.applyFilters();
    this.messageService.add(
      { severity: 'info', summary: 'Importante',
        detail: 'Selecione as questões desejadas clicando ou tocando nelas.' });
  }

  cancelSelectingQuestions() {
    this.emptyExamCreationData();
    this.applyFilters();
  }

  toggleQuestionSelection(questionId?: number) {
    if (!this.isSelectingQuestions || !questionId || !this.maxQuestionsNumberReached()) { return; }
    
    if (this.examToBeCreated.questions.includes(questionId)) {
      this.examToBeCreated.questions = this.examToBeCreated.questions.filter(
        (id) => id !== questionId);
    } else {
      this.examToBeCreated.questions.push(questionId);
    }
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible; // Alterna a visibilidade do Sidebar
  }

  toggleDifficulty(difficulty: Difficulty): void {
    this.selectedDifficulty = this.selectedDifficulty === difficulty ? undefined : difficulty;
  }

  private createExam() {
    this.examApiService.createExamManually(this.examToBeCreated).subscribe({
      next: (response) => {
        this.messageService.add(
          { severity: 'success', summary: 'Sucesso', detail: 'Prova criada com sucesso.' });
        this.emptyExamCreationData();
        this.applyFilters();
      },
      error: (error) => {
        this.messageService.add(
          { severity: 'error', summary: 'Erro', detail: 'Erro ao criar a prova.' });
        console.error('Error creating exam', error);
        this.emptyExamCreationData();
        this.applyFilters();
      },
    });
  }

  private emptyExamCreationData() {
    this.isSelectingQuestions = false;
    this.examToBeCreated = { title: '', instructions: '', subject_id: 0, questions: [] };
    this.selectedSubject = undefined;
  }

  private maxQuestionsNumberReached(): boolean {
    return this.examToBeCreated.questions.length <= this.MAX_QUESTIONS;
  }
}
