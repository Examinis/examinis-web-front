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
import { catchError, forkJoin, tap } from 'rxjs';
import { Page } from '../../shared/interfaces/page';

@Component({
  selector: 'app-question-list',
  templateUrl: './list-question.component.html',
  imports: [CommonModule, FormsModule, FilterCategoryPipe, FilterDifficultyPipe],
  styleUrls: ['./list-question.component.css']
})
export class QuestionListComponent {

  pageOfQuestions: Page<Question> = {
    total: 0,
    page: 0,
    size: 0,
    results: []
  };
  categories: Subject[] = [
  ];
  selectedSubject?: Subject;
  selectedDifficulty?: Difficulty;
  difficulties: Difficulty[] = [
    { id: 1, name: 'Fácil' },
    { id: 2, name: 'Médio' },
    { id: 3, name: 'Difícil' }
  ]

  private questionApiService: QuestionApiService = inject(QuestionApiService);
  private subjectApiService: SubjectApiService = inject(SubjectApiService);

  constructor(private questionService: QuestionApiService) { }

  ngOnInit(): void {

    forkJoin({
      subjects: this.subjectApiService.getSubjects().pipe(
        tap(subjects => console.log('Subjects loaded:', subjects)),
        catchError(error => {
          console.error('Error fetching subjects', error);
          return [];
        })
      ),
      questions: this.questionApiService.getQuestions().pipe(
        tap(questions => console.log('Questions loaded:', questions)),
        catchError(error => {
          console.error('Error fetching questions', error);
          return [];
        })
      )
    }).subscribe({
      next: ({ subjects, questions }) => {
        this.categories = subjects;
        this.pageOfQuestions = questions;
      },
      error: error => console.error('Error in forkJoin', error)
    });

  }

  deleteQuestion(questionId: number): void {
    if (confirm('Você tem certeza que deseja deletar esta questão?')) {
      this.questionApiService.deleteQuestion(questionId).pipe(
        tap(() => {
          // Recarrega as questões após a exclusão
          this.loadQuestions();
        }),
        catchError(error => {
          console.error('Erro ao deletar a questão', error);
          return [];
        })
      ).subscribe();
    }
  }
  
  loadQuestions(): void {
    this.questionApiService.getQuestions().pipe(
      tap(questions => {
        this.pageOfQuestions = questions;
      }),
      catchError(error => {
        console.error('Erro ao carregar as questões', error);
        return [];
      })
    ).subscribe();
  }
  toggleDifficulty(difficulty: Difficulty): void {

    if (this.selectedDifficulty === difficulty) {
      this.selectedDifficulty = undefined;
    } else {
      this.selectedDifficulty = difficulty;
    }
  }
}
