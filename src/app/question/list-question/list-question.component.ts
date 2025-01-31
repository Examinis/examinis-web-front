import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';

import { QuestionApiService } from '../../shared/services/question-api.service';
import { SubjectApiService } from '../../shared/services/subject-api.service';

import { Question } from '../../shared/interfaces/question';
import { Subject } from '../../shared/interfaces/subject';
import { Difficulty } from '../../shared/interfaces/difficulty';
import { Page } from '../../shared/interfaces/page';

import { FilterCategoryPipe } from '../../shared/pipes/filter-category.pipe';
import { FilterDifficultyPipe } from '../../shared/pipes/filter-difficulty.pipe';


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
    DropdownModule,
    ConfirmDialogModule,
    ButtonModule,
    ToastModule,
    FilterCategoryPipe,
    FilterDifficultyPipe
  ],
})
export class QuestionListComponent implements OnInit {
  private questionApiService = inject(QuestionApiService);
  private subjectApiService = inject(SubjectApiService);

  questions: Page<Question> = { total: 0, page: 1, size: 10, results: [] };
  filteredQuestions: Question[] = [];

  categories: Subject[] = [];
  selectedSubject?: Subject;

  difficulties: Difficulty[] = [
    { id: 1, name: 'Fácil' },
    { id: 2, name: 'Médio' },
    { id: 3, name: 'Difícil' },
  ];
  selectedDifficulty?: Difficulty;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadData();
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
        this.categories = subjects;
        this.questions = questions;
        this.applyFilters();
      },
      error: (error) => console.error('Error in forkJoin', error),
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }


  applyFilters(): void {
    this.filteredQuestions = this.questions.results.filter((question) => {
      const subjectMatch = !this.selectedSubject || (question.subject && question.subject.id === this.selectedSubject.id);
      const difficultyMatch = !this.selectedDifficulty || (question.difficulty && question.difficulty.id === this.selectedDifficulty.id);
      return subjectMatch && difficultyMatch;
    });
  }

  onPageChange(event: any): void {
    this.loadData(event.page + 1, event.rows);
  }

  viewQuestion(question: Question): void {
    console.log('Visualizando questão:', question);
  }

  editQuestion(question: Question): void {
    console.log('Editando questão:', question);
  }

  deleteQuestion(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Tem certeza de que deseja excluir esta questão?',
      header: 'Atenção!',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Excluir',
        severity: 'danger',
      },
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Excluído', detail: 'Questão excluída' });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Exclusão cancelada' });
      },
    });
  }

  toggleDifficulty(difficulty: Difficulty): void {
    this.selectedDifficulty = this.selectedDifficulty === difficulty ? undefined : difficulty;
  }
}