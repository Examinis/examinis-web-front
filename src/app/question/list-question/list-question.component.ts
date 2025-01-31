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
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-question-list',
  templateUrl: './list-question.component.html',
  imports: [CommonModule, FormsModule,
    CardModule,
    TableModule,
    PaginatorModule,
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
    this.loadData(1, this.questions.size);
  }

  loadData(page: number, size: number): void {
    forkJoin({
      subjects: this.subjectApiService.getSubjects().pipe(
        catchError(error => {
          console.error('Error fetching subjects', error);
          return [];
        })
      ),
      questions: this.questionApiService.getQuestions(page, size).pipe(
        catchError(error => {
          console.error('Error fetching questions', error);
          return [];
        })
      )
    }).subscribe({
      next: ({ subjects, questions }) => {
        this.categories = subjects;
        this.questions = questions;
      },
      error: error => console.error('Error in forkJoin', error)
    });
  }

  onPageChange(event: any): void {
    this.loadData(event.page, event.rows);
  }

  viewQuestion(question: Question): void {
    console.log('Visualizando questão:', question);
    // Adicione a lógica para exibir os detalhes da questão
  }
  
  editQuestion(question: Question): void {
    console.log('Editando questão:', question);
    // Adicione a lógica para edição
  }
  
  deleteQuestion(question: Question): void {
    console.log('Excluindo questão:', question);
    // Adicione a lógica para excluir a questão
  }

  toggleDifficulty(difficulty: Difficulty): void {

    if (this.selectedDifficulty === difficulty) {
      this.selectedDifficulty = undefined;
    } else {
      this.selectedDifficulty = difficulty;
    }
  }
}
