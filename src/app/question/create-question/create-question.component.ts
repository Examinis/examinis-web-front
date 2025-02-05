import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';
import { IftaLabelModule } from 'primeng/iftalabel';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Difficulty } from '../../shared/interfaces/difficulty';
import { Option } from '../../shared/interfaces/option';
import { QuestionSend } from '../../shared/interfaces/question-send';
import { Subject } from '../../shared/interfaces/subject';
import { QuestionApiService } from '../../shared/services/question-api.service';
import { SubjectApiService } from '../../shared/services/subject-api.service';
import { OptionSelectComponent } from "./option-select/option-select.component";
import { ActivatedRoute } from '@angular/router';
import { Question } from '../../shared/interfaces/question';
import { DifficultyApiService } from '../../shared/services/difficulty-api.service';
import { Toast } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { SidebarDrawerComponent } from '../../shared/components/sidebar-drawer/sidebar-drawer.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


interface UploadEvent {
  files: File[];
}

@Component({
  selector: 'app-create-question',
  imports: [
    PanelModule, ButtonModule, TextareaModule, ReactiveFormsModule, IftaLabelModule,
    SelectModule, FileUpload, OptionSelectComponent, Toast, SidebarDrawerComponent, ConfirmDialogModule,],
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.css',
  providers: [ConfirmationService, MessageService],
})
export class CreateQuestionComponent implements OnInit {
  question: Question = {
    text: '',
    subject: { name: '' },
    difficulty: { name: '' },
    options: []
  };

  visible: boolean = true;

  subjects: Subject[] = [];
  difficulties: Difficulty[] = [];
  uploadedFiles: any[] = [];

  questionCreationForm = new FormGroup({
    questionText: new FormControl('', Validators.required),
    subject: new FormControl({
      id: 0,
      name: ''
    } as Subject, Validators.required),
    difficulty: new FormControl({
      id: 0,
      name: ''
    } as Difficulty, Validators.required),
  });
  variableLabels = {
    button: 'Salvar',
    heading: 'Criar questão',
    messageSuccess: 'Questão criada com sucesso!',
    messageError: 'Ocorreu um erro ao criar a questão.'
  }

  private questionApi = inject(QuestionApiService);
  private subjectApi = inject(SubjectApiService);
  private difficultyApi = inject(DifficultyApiService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) { }

  goTo(page: string): void {
    this.router.navigate(['/' + page]);
  }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      const questionId = params.get('id');
      if (questionId) {

        this.variableLabels.button = 'Atualizar';
        this.variableLabels.heading = 'Atualizar questão';
        this.variableLabels.messageSuccess = 'Questão atualizada com sucesso!';
        this.variableLabels.messageError = 'Ocorreu um erro ao atualizar a questão.';

        this.questionApi.getQuestionById(+questionId).subscribe({
          next: (q) => {
            this.question = q;
            this.fillForm(q);
          },
          error: (error) => {
            console.error('Error fetching question', error);
          }
        });
      }
    });

    this.subjectApi.getSubjects().subscribe(
      {
        next: (subjects) => { this.subjects = subjects; },
        error: (error) => { console.error('Error fetching subjects', error); }
      }
    );

    this.difficultyApi.getDifficulties().subscribe(
      {
        next: (difficulties) => { this.difficulties = difficulties; },
        error: (error) => { console.error('Error fetching difficulties', error); }
      }
    );
  }

  onOptionsChanged(options: Option[]) {
    this.question.options = options;
  }

  toggleSidebar() {
    this.visible = !this.visible; // Alterna a visibilidade do Sidebar
  }

  /**
   * Handles the file upload event triggered by a user interaction.
   * This method processes the files provided by the event and 
   * updates the list of uploaded files.
   * 
   * Functionality:
   * - If no files are currently uploaded, adds the first file from the event to the list.
   * 
   * @param {UploadEvent} event - The event containing the uploaded file(s).
   * @example
   * // Example of triggering the upload:
   * <input type="file" (change)="onUpload($event)">
   */
  onUpload(event: UploadEvent) {
    if (this.uploadedFiles.length === 0) {
      this.uploadedFiles.push(event.files[0]);
    }
    // this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

  createOrUpdateQuestion() {
    // Check if the form is valid
    if (this.questionCreationForm.invalid) { return; }

    const questionToSend: QuestionSend = {
      id: this.question.id, // If the question has an ID, it's an update
      text: this.questionCreationForm.get('questionText')?.value || '',
      subjectId: this.questionCreationForm.get('subject')?.value?.id || 0,
      difficultyId: this.questionCreationForm.get('difficulty')?.value?.id || 0,
      options: this.question.options
    };

    if (questionToSend.id) {
      this.showConfirmationDialog(questionToSend);
    } else {
      this.createQuestion(questionToSend);
    }

  }

  private showConfirmationDialog(questionToSend: QuestionSend) {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja atualizar esta questão?',
      header: 'Atenção!',
      acceptLabel: 'Atualizar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.updateQuestion(questionToSend);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Edição cancelada.',
        });
      },
    });
  }

  private createQuestion(question: QuestionSend) {
    if (question.options.map(o => o.isCorrect).filter(c => c).length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Cadastro', detail: 'A questão deve ter pelo menos uma resposta correta.', life: 3000 });
      return;
    }

    if (question.options.map(o => o.description).filter(t => t === '').length > 0) {
      this.messageService.add({ severity: 'error', summary: 'Cadastro', detail: 'Todas as opções devem ter texto.', life: 3000 });
      return;
    }

    this.questionApi.createQuestion(question).subscribe(
      {
        next: () => {
          console.log('Question created successfully');
          this.messageService.add({ severity: 'success', summary: 'Cadastro', detail: this.variableLabels.messageSuccess, life: 3000 });
        },
        error: (error) => {
          console.error('Error creating question', error);
          this.messageService.add({ severity: 'error', summary: 'Cadastro', detail: this.variableLabels.messageError, life: 3000 });
        }
      });

    this.questionCreationForm.reset();
  }

  private updateQuestion(question: QuestionSend) {
    this.questionApi.updateQuestion(question).subscribe(
      {
        next: () => {
          console.log('Question updated successfully');
          this.messageService.add({ severity: 'success', summary: 'Atualização', detail: this.variableLabels.messageSuccess, life: 3000 });
        },
        error: (error) => {
          console.error('Error updating question', error);
          this.messageService.add({ severity: 'error', summary: 'Atualização', detail: this.variableLabels.messageError, life: 3000 });
        }
      });
  }

  private fillForm(question: Question) {
    // this.questionCreationForm.get('questionText')?.setValue(question.text);
    // this.questionCreationForm.get('subject')?.setValue(question.subject);
    // this.questionCreationForm.get('difficulty')?.setValue(question.difficulty);
    this.questionCreationForm.patchValue({
      questionText: question.text,
      subject: question.subject,
      difficulty: question.difficulty
    });
  }

}
