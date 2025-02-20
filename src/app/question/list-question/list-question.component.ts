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
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { QuestionApiService } from '../../shared/services/question-api.service';
import { SubjectApiService } from '../../shared/services/subject-api.service';

import { Difficulty } from '../../shared/interfaces/difficulty';
import { Page } from '../../shared/interfaces/page';
import { QuestionList } from '../../shared/interfaces/question';
import { Subject } from '../../shared/interfaces/subject';


import { Router, RouterModule } from '@angular/router';

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
    DialogModule,
    AutoCompleteModule,
  ],
})
export class QuestionListComponent implements OnInit {

  private questionApiService = inject(QuestionApiService);
  private subjectApiService = inject(SubjectApiService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);

  subjects: Subject[] = [];
  difficulties: Difficulty[] = [
    { id: 1, name: 'Fácil' },
    { id: 2, name: 'Médio' },
    { id: 3, name: 'Difícil' },
  ];
  questions: Page<QuestionList> = { total: 0, page: 1, size: 10, results: [] };

  // Variáveis para controle do modal de filtro
  filterDialogVisible = false;
  selectedSubject?: Subject;
  selectedDifficulty?: Difficulty;

  sidebarVisible?: boolean;
  createExamDialogVisible: boolean = false;
  isSelectingQuestions: boolean = false;

  filteredSubjects = this.subjects;
  filteredDifficulties = this.difficulties;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }

  trackById(index: number, question: any): number {
    return question.id;
  }

  showFilterDialog() {
    this.filterDialogVisible = true;
  }

  hideFilterDialog() {
    this.filterDialogVisible = false;
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
        this.questions = questions;
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

  searchSubject(event: any) {
    this.filteredSubjects = this.subjects.filter(subject => {
      return subject.name.toLowerCase().includes(event.query.toLowerCase());
    });
  }

  searchDifficulty(event: any) {
    this.filteredDifficulties = this.difficulties.filter(difficulty => {
      return difficulty.name.toLowerCase().includes(event.query.toLowerCase());
    });
  }

  clearFilters() {
    this.selectedSubject = undefined;
    this.selectedDifficulty = undefined;
    this.filteredSubjects = [];
    this.filteredDifficulties = [];
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.questionApiService.getFilteredQuestions(this.questions.page, this.questions.size,
      this.selectedSubject?.id, this.selectedDifficulty?.id
    ).subscribe({
      next: (questions) => this.questions = { ...questions },
      error: () => console.error("Algo deu errado durante a filtragem de questões.")
    });
  }

  onPageChange(event: any) {
    this.questionApiService.getFilteredQuestions(event.page + 1, event.rows, this.selectedSubject?.id, this.selectedDifficulty?.id).subscribe(questions => {
      this.questions = {
        ...questions,
        results: questions.results || []
      };
    });
  }

  viewQuestion(id?: number): void {
    if (!id) { return; }
    this.router.navigate(['questions', id]);
  }

  editQuestion(id?: number): void {
    if (!id) { return; }
    this.router.navigate(['questions/edit', id]);
  }

  deleteQuestion(questionId: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja excluir esta questão?',
      header: 'Atenção!',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
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

  handleChooseQuestionsPressed(selectedSubject: Subject) {
    this.selectedSubject = selectedSubject;
    this.isSelectingQuestions = true;
    this.applyFilters();
    this.messageService.add(
      {
        severity: 'info', summary: 'Importante',
        detail: 'Selecione as questões desejadas clicando ou tocando nelas.'
      });
  }

  cancelSelectingQuestions() {
    this.emptyExamCreationData();
    this.applyFilters();
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible; // Alterna a visibilidade do Sidebar
  }

  toggleDifficulty(difficulty: Difficulty): void {
    this.selectedDifficulty = this.selectedDifficulty === difficulty ? undefined : difficulty;
  }

  private emptyExamCreationData() {
    this.isSelectingQuestions = false;
    this.selectedSubject = undefined;
  }
}
