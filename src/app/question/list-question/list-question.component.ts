import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionApiService } from '../../shared/services/question-api.service';
import { Question } from '../../shared/interfaces/question';
import { FormsModule } from '@angular/forms';
import { FilterCategoryPipe } from '../../shared/pipes/filter-category.pipe';
import { FilterDifficultyPipe } from '../../shared/pipes/filter-difficulty.pipe';
import { Subject } from '../../shared/interfaces/subject';
import { Difficulty } from '../../shared/interfaces/difficulty';
import { SubjectApiService } from '../../shared/services/subject-api.service';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { Page } from '../../shared/interfaces/page';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-question-list',
  templateUrl: './list-question.component.html',
  imports: [CommonModule, FormsModule,
    CardModule,
    TableModule,
    PaginatorModule,
    DropdownModule,
    FilterCategoryPipe, FilterDifficultyPipe],
  styleUrls: ['./list-question.component.css']
})
export class QuestionListComponent implements OnInit {

  questions: Page<Question> = {
    total: 0,
    page: 1,
    size: 10,
    results: []
  };
  filteredQuestions: Question[] = [];

  categories: Subject[] = [];
  selectedSubject?: Subject;
  selectedDifficulty?: Difficulty;
  difficulties: Difficulty[] = [
    { id: 1, name: 'Fácil' },
    { id: 2, name: 'Médio' },
    { id: 3, name: 'Difícil' }
  ]

  private questionApiService: QuestionApiService = inject(QuestionApiService);
  private subjectApiService: SubjectApiService = inject(SubjectApiService);

  ngOnInit(): void {
    this.loadData(1, this.questions.size);
  }

  loadData(page = 1, size = this.questions.size): void {
    forkJoin({
      subjects: this.subjectApiService.getSubjects().pipe(catchError(error => {
        console.error('Error fetching subjects', error);
        return of([]);
      })),
      questions: this.questionApiService.getQuestions(page, size).pipe(catchError(error => {
        console.error('Error fetching questions', error);
        return of({ total: 0, page: 1, size: 10, results: [] });
      }))
    }).subscribe({
      next: ({ subjects, questions }) => {
        this.categories = subjects;
        this.questions = questions;
        this.applyFilters();
      },
      error: error => console.error('Error in forkJoin', error)
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredQuestions = this.questions.results.filter(question => {
      const subjectMatch = !this.selectedSubject || (question.subject && question.subject.id === this.selectedSubject.id);
      const difficultyMatch = !this.selectedDifficulty || (question.difficulty && question.difficulty.id === this.selectedDifficulty.id);
      return subjectMatch && difficultyMatch;
    });
  }

  onPageChange(event: any): void {
    const page = event.first || 0;
    this.questions.page = Math.floor(page / this.questions.size) + 1;
    this.questions.size = event.rows;
    this.loadData(this.questions.page, this.questions.size);
  }
  

  viewQuestion(question: Question): void {
    console.log('Visualizando questão:', question);
  }

  editQuestion(question: Question): void {
    console.log('Editando questão:', question);
  }

  deleteQuestion(question: Question): void {
    console.log('Excluindo questão:', question);
  }

  toggleDifficulty(difficulty: Difficulty): void {

    if (this.selectedDifficulty === difficulty) {
      this.selectedDifficulty = undefined;
    } else {
      this.selectedDifficulty = difficulty;
    }
  }
}
