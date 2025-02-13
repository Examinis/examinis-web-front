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
  private confirmationService: ConfirmationService = inject(ConfirmationService);

  constructor() { }

  ngOnInit() {
    this.loadInitialData();
  }

  // Carrega os dados iniciais (disciplinas, dificuldades e exames)
  loadInitialData() {
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

        // Verifique os dados recebidos
        console.log('Exams:', exams);

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

  // Retorna o número de questões de um exame
  getNumQuestions(exam: Exam): number {
    return exam.total_question;
  }

  formatDate(dateString: string): string {
    // Converte a string "dd/MM/yyyy HH:mm:ss" para um objeto Date
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);

    // Formata a data usando o pipe date do Angular
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
      this.exams = exams;
      this.onFilterChange(); // Reaplica os filtros após a mudança de página
    });
  }

  // Abre o diálogo de criação de exame
  showCreateExamDialog() {
    this.createExamDialogVisible = true;
  }

  // Fecha o diálogo de criação de exame e recarrega os exames
  closeCreateExamDialog() {
    this.createExamDialogVisible = false;

    // Recarrega os exames para incluir o novo
    this.examApiService.getExams(this.exams.page, this.exams.size).subscribe(exams => {
      this.exams = exams;
      this.onFilterChange(); // Reaplica os filtros após recarregar
    });
  }

  onFilterChange() {
    console.log("Filtro alterado", this.selectedSubject, this.selectedDifficulty, this.maxNumOfQuestions);

    this.filteredExams = this.exams.results.filter(exam => {
      const subjectMatch = this.selectedSubject ? exam.subject.id === this.selectedSubject.id : true;
      const numQuestionsMatch = this.maxNumOfQuestions ? (exam.total_question || 0) <= this.maxNumOfQuestions : true;
      return subjectMatch && numQuestionsMatch;
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
