import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { CreateExamDialogComponent } from '../../exam/create-exam-dialog/create-exam-dialog.component';
import { ExamManualCreate } from '../../shared/interfaces/exam/exam-create';
import { Page } from '../../shared/interfaces/page';
import { QuestionList } from '../../shared/interfaces/question';
import { Subject } from '../../shared/interfaces/subject';
import { ExamApiService } from '../../shared/services/exam-api.service';
import { QuestionApiService } from '../../shared/services/question-api.service';
import { SubjectApiService } from '../../shared/services/subject-api.service';

@Component({
  selector: 'app-create-exam-manual',
  imports: [
    DialogModule, FormsModule, ReactiveFormsModule, AutoCompleteModule, 
    ButtonModule, PaginatorModule, CommonModule, 
    CreateExamDialogComponent, ToastModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './create-exam-manual.component.html',
  styleUrl: './create-exam-manual.component.css'
})
export class CreateExamManualComponent {
  showExamDialog: boolean = true;

  subject: Subject | null = null;
  subjects: Subject[] = [];

  questions: Page<QuestionList> = { total: 0, page: 1, size: 10, results: [] };
  selectedQuestions: QuestionList[] = [];

  examToBeCreated: ExamManualCreate = { title: '', instructions: '', subject_id: 0, questions: [] };

  private examService: ExamApiService = inject(ExamApiService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);

  constructor(private subjectService: SubjectApiService, private questionService: QuestionApiService, private router: Router) { }

  ngOnInit(): void {
    this.subjectService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
    });
  }

  fetchQuestions(): void {
    this.questionService.getFilteredQuestions(1, 10, this.subject?.id).subscribe(questions => {
      this.questions = {
        ...questions,
        results: questions.results || []
      };
    });
  }

  onPageChange(event: any) {
    this.questionService.getFilteredQuestions(event.page + 1, event.rows, this.subject?.id).subscribe(questions => {
      this.questions = {
        ...questions,
        results: questions.results || []
      };
    });
  }

  closeCreateExamDialog() {
    this.showExamDialog = false;
  }

  handleDialogSubmitted(examData: ExamManualCreate): void {
    this.examToBeCreated = examData;
    this.showExamDialog = false;
  }

  handleChooseQuestionsPressed(selectedSubject: Subject) {
    this.subject = selectedSubject;
    this.fetchQuestions();
  }

  toggleQuestionSelection(questionId?: number) {
    if (!questionId || !(this.examToBeCreated.questions.length < 20)) { return; }
    
    if (this.examToBeCreated.questions.includes(questionId)) {
      this.examToBeCreated.questions = this.examToBeCreated.questions.filter(
        (id) => id !== questionId);
    } else {
      this.examToBeCreated.questions.push(questionId);
    }
  }
  
  confirmExamCreation() {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja criar a prova?',
      header: 'Atenção!',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.submitExam();
      },
      reject: () => {
        this.messageService.add(
          { severity: 'info', summary: 'Cancelado', detail: 'Criação de exame cancelada.' });
      },
    });
  }

  submitExam() {
    this.examService.createExamManually(this.examToBeCreated).subscribe(() => {
      this.router.navigate(['/exams']);
    });
  }
}