import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { SidebarDrawerComponent } from "../../shared/components/sidebar-drawer/sidebar-drawer.component";
import { SelectModule } from 'primeng/select';
import { Exam } from '../../shared/interfaces/exam';
import { Page } from '../../shared/interfaces/page';
import { Subject } from '../../shared/interfaces/subject';
import { Difficulty } from '../../shared/interfaces/difficulty';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CreateExamDialogComponent } from '../create-exam-dialog/create-exam-dialog.component';
import { SubjectApiService } from '../../shared/services/subject-api.service';
import { catchError, forkJoin, of } from 'rxjs';
import { DifficultyApiService } from '../../shared/services/difficulty-api.service';
import { ExamApiService } from '../../shared/services/exam-api.service';

@Component({
  selector: 'app-list-exam',
  imports: [SidebarDrawerComponent, ConfirmDialogModule, ToastModule,
    PaginatorModule, CommonModule, SelectModule, FormsModule, ButtonModule,
    InputNumberModule, CreateExamDialogComponent,
  ],
  templateUrl: './list-exam.component.html',
  styleUrl: './list-exam.component.css',
  providers: [MessageService, ConfirmationService]
})
export class ListExamComponent {

  exams: Page<Exam> = { total: 0, page: 1, size: 8, results: [] };
  filteredExams: Exam[] = [];

  subjects: Subject[] = [];
  selectedSubject?: Subject;
  difficulties: Difficulty[] = [];
  selectedDifficulty?: Difficulty;
  maxNumOfQuestions: number = 10;

  createExamDialogVisible: boolean = false;

  private router: Router = inject(Router);
  private subjectApiService: SubjectApiService = inject(SubjectApiService);
  private difficultyApiService: DifficultyApiService = inject(DifficultyApiService);
  private examApiService: ExamApiService = inject(ExamApiService);

  constructor() { }

  ngOnInit() {
    forkJoin({
      subjects: this.subjectApiService.getSubjects().pipe(
        catchError(() => of([]))
      ),
      difficulties: this.difficultyApiService.getDifficulties().pipe(
        catchError(() => of([]))
      ),
      exams: this.examApiService.getExams().pipe(
        catchError(() => of({ total: 0, page: 1, size: 8, results: [] }))
      )
    }).subscribe({
      next: ({ subjects, difficulties, exams }) => {
        this.subjects = subjects;
        this.difficulties = difficulties;
        this.exams = exams;
      },
      error: (error) => console.error('Error in forkJoin', error),
    });
  }

  viewExam(examId: number) {
    this.router.navigate(['/exams', examId]);
  }

  editExam(examId: number) {
    this.router.navigate(['/exams/edit', examId]);
  }

  deleteExam(examId: number) {
    this.examApiService.deleteExam(examId).subscribe(() => {
      this.exams.results = this.exams.results.filter(exam => exam.id !== examId);
      this.exams.total--;
    });
  }

  onPageChange(event: any) {
    this.examApiService.getExams(event.page + 1, event.rows).subscribe(exams => {
      this.exams = exams;
    });
  }

  showCreateExamDialog() {
    this.createExamDialogVisible = true;
  }

  closeCreateExamDialog() {
    this.createExamDialogVisible = false;
  }
onFilterChange() {
  console.log("Filtro alterado", this.selectedSubject, this.selectedDifficulty, this.maxNumOfQuestions);

  this.filteredExams = this.exams.results.filter(exam => {
    const subjectMatch = this.selectedSubject ? exam.subjectId === this.selectedSubject.id : true;
    const difficultyMatch = this.selectedDifficulty ? exam.difficultyId === this.selectedDifficulty.id : true;
    return subjectMatch && difficultyMatch;
  });
}

  // private mockExams(): Page<Exam> {
  //   return {
  //     total: 10,
  //     page: 1,
  //     size: 8,
  //     results: [
  //       { id: 1, title: 'Prova 1', createdAt: new Date(), updatedAt: new Date(), userId: 1 },
  //       { id: 2, title: 'Prova 2', createdAt: new Date(), updatedAt: new Date(), userId: 1 },
  //       { id: 3, title: 'Prova 3', createdAt: new Date(), updatedAt: new Date(), userId: 1 },
  //       { id: 4, title: 'Prova 4', createdAt: new Date(), updatedAt: new Date(), userId: 1 },
  //       { id: 5, title: 'Prova 5', createdAt: new Date(), updatedAt: new Date(), userId: 1 },
  //       { id: 6, title: 'Prova 6', createdAt: new Date(), updatedAt: new Date(), userId: 1 },
  //       { id: 7, title: 'Prova 7', createdAt: new Date(), updatedAt: new Date(), userId: 1 },
  //       { id: 8, title: 'Prova 8', createdAt: new Date(), updatedAt: new Date(), userId: 1 }
  //     ]
  //   };
  // }
}
