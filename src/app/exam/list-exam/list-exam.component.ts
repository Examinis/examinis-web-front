import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { catchError, forkJoin, of } from 'rxjs';
import { Exam } from '../../shared/interfaces/exam';
import { ExamAutomaticCreate, ExamManualCreate } from '../../shared/interfaces/exam/exam-create';
import { Page } from '../../shared/interfaces/page';
import { Subject } from '../../shared/interfaces/subject';
import { ExamApiService } from '../../shared/services/exam-api.service';
import { SubjectApiService } from '../../shared/services/subject-api.service';
import { CreateExamDialogComponent } from '../create-exam-dialog/create-exam-dialog.component';

@Component({
  selector: 'app-list-exam',
  imports: [ConfirmDialogModule, ToastModule,
    PaginatorModule, CommonModule, SelectModule, FormsModule, ButtonModule,
    InputNumberModule, CreateExamDialogComponent,
  ],
  templateUrl: './list-exam.component.html',
  styleUrl: './list-exam.component.css',
  providers: [MessageService, ConfirmationService]
})
export class ListExamComponent {

  private router: Router = inject(Router);
  private subjectApiService: SubjectApiService = inject(SubjectApiService);
  private examApiService: ExamApiService = inject(ExamApiService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);

  exams: Page<Exam> = { total: 0, page: 1, size: 8, results: [] };
  filteredExams: Exam[] = [];

  subjects: Subject[] = [];
  selectedSubject?: Subject;

  teachers: { id: number; first_name: string; last_name: string; fullName: string }[] = []; // Lista de professores com nome completo
  selectedTeacher?: { id: number; first_name: string; last_name: string; fullName: string }; // Professor selecionado

  maxNumOfQuestions: number = 10;

  createExamDialogVisible: boolean = false;

  constructor() { }

  ngOnInit() {
    this.loadInitialData();
  }

  // Carrega os dados iniciais (disciplinas, professores e exames)
  loadInitialData() {
    forkJoin({
      subjects: this.subjectApiService.getSubjects().pipe(
        catchError(() => of([]))
      ),
      exams: this.examApiService.getExams().pipe(
        catchError(() => of({ total: 0, page: 1, size: 8, results: [] }))
      )
    }).subscribe({
      next: ({ subjects, exams }) => {
        this.subjects = subjects;

        // Extrai a lista de professores únicos dos exames
        this.teachers = this.extractUniqueTeachers(exams.results);

        // Garante que exams.results seja um array
        this.exams = {
          ...exams,
          results: exams.results || []
        };

        // Aplica os filtros iniciais
        this.onFilterChange();
      },
      error: (error) => console.error('Error in forkJoin', error),
    });
  }

  // Extrai a lista de professores únicos dos exames
  private extractUniqueTeachers(exams: Exam[]): { id: number; first_name: string; last_name: string; fullName: string }[] {
    const teachersMap = new Map<number, { id: number; first_name: string; last_name: string; fullName: string }>();
    exams.forEach(exam => {
      if (exam.user && !teachersMap.has(exam.user.id)) {
        teachersMap.set(exam.user.id, {
          ...exam.user,
          fullName: `${exam.user.first_name} ${exam.user.last_name}` // Adiciona o nome completo
        });
      }
    });
    return Array.from(teachersMap.values());
  }

  // Formata a data de criação
  formatDate(dateString: string): string {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // Navega para a página de visualização de um exame
  viewExam(examId: number) {
    this.router.navigate(['/exams', examId]);
  }

  // Exclui um exame
  deleteExam(examId: number) {
    this.examApiService.deleteExam(examId).subscribe(() => {
      this.exams.results = this.exams.results.filter(exam => exam.id !== examId);
      this.exams.total--;
      this.onFilterChange(); // Reaplica os filtros após a exclusão
    });
  }

  // Atualiza a lista de exames quando a página é alterada
  onPageChange(event: any) {
    this.examApiService.getExams(event.page + 1, event.rows).subscribe(exams => {
      this.exams = {
        ...exams,
        results: exams.results || []
      };
      this.onFilterChange(); // Reaplica os filtros após a mudança de página
    });
  }

  handleDialogSubmitted(examData: ExamAutomaticCreate | ExamManualCreate) {
    this.examApiService.createExamAutomatically(examData as ExamAutomaticCreate).subscribe({
      next: (response) => {
        console.log('Exam created', response);
        this.closeCreateExamDialog();
      },
      error: (error) => {
        console.error('Error creating exam', error);
      }
    });
  }

  showCreateExamDialog() {
    this.createExamDialogVisible = true;
  }

  // Fecha o diálogo de criação de exame e recarrega os exames
  closeCreateExamDialog() {
    this.createExamDialogVisible = false;

    // Recarrega os exames para incluir o novo
    this.examApiService.getExams(this.exams.page, this.exams.size).subscribe(exams => {
      this.exams = {
        ...exams,
        results: exams.results || []
      };
      this.onFilterChange(); // Reaplica os filtros após recarregar
    });
  }

  /**
   * Handles the filter change event by fetching filtered exams from the API.
   * It uses the selected subject and teacher IDs to filter the exams.
   * Updates the exams list with the filtered results.
   * Logs an error message to the console if the filtering process fails.
   *
   * @returns {void}
   */
  onFilterChange() {
    this.examApiService.getFilteredExams(this.exams.page, this.exams.size,
      this.selectedSubject?.id, this.selectedTeacher?.id
    ).subscribe({
      next: (exams) => this.exams = { ...exams },
      error: () => console.error("Algo deu errado durante a filtragem")
    });
  }

  // Confirma a exclusão de um exame
  confirmDeleteExam(examId: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja excluir esta prova?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteExam(examId);
      }
    });
  }
}
