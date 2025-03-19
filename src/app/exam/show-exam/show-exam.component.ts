import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { SpecificExam } from '../../shared/interfaces/exam/specific-exam';
import { ExamApiService } from '../../shared/services/exam-api.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-show-exam',
  standalone: true,
  imports: [
    CommonModule, 
    ProgressSpinnerModule,
    PanelModule,
    ButtonModule,
    CardModule,
    DividerModule,
    MessageModule,
    MessagesModule
  ],
  templateUrl: './show-exam.component.html',
  styleUrl: './show-exam.component.css'
})
export class ShowExamComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private examApiService = inject(ExamApiService);
  
  exam: SpecificExam | null = null;
  loading = true;
  error = false;
  errorMessage = '';

  ngOnInit(): void {
    // Get exam ID from route parameters
    const examId = this.route.snapshot.paramMap.get('id');
    
    if (examId) {
      this.loadExam(+examId); // Convert string to number with +
    } else {
      this.error = true;
      this.errorMessage = 'ID da prova não encontrado na URL';
      this.loading = false;
    }
  }

  /**
   * Loads an exam by its ID using the ExamApiService
   * @param id The exam ID to load
   */
  loadExam(id: number): void {
    this.loading = true;
    this.error = false;
    
    this.examApiService.getExamById(id)
      .pipe(
        catchError(error => {
          this.error = true;
          this.errorMessage = `Erro ao carregar a prova: ${error.message || 'Desconhecido'}`;
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(exam => {
        if (exam) {
          this.exam = exam;
          console.log('Exam loaded:', exam);
        }
      });
  }
  
  /**
   * Format the exam creation date to a readable format
   * @param dateString The date string from the API
   * @returns Formatted date string
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  /**
   * Navigate back to the exams list
   */
  goBack(): void {
    this.router.navigate(['/exams']);
  }
}
