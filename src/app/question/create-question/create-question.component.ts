import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';
import { IftaLabelModule } from 'primeng/iftalabel';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Difficulty } from '../../shared/models/difficulty';
import { Option } from '../../shared/models/option';
import { QuestionSend } from '../../shared/interfaces/question-send';
import { Subject } from '../../shared/interfaces/subject';
import { QuestionApiService } from '../../shared/services/question-api.service';
import { SubjectApiService } from '../../shared/services/subject-api.service';
import { OptionSelectComponent } from "./option-select/option-select.component";

interface UploadEvent {
  files: File[];
}

@Component({
  selector: 'app-create-question',
  imports: [PanelModule, ButtonModule, TextareaModule, ReactiveFormsModule, IftaLabelModule,
    SelectModule, FileUpload, OptionSelectComponent],
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.css'
})
export class CreateQuestionComponent implements OnInit {

  question: QuestionSend = {
    text: '',
    subjectId: 0,
    difficultyId: 0,
    options: []
  };

  subjects: Subject[] = [];
  difficulties: Difficulty[] = [];
  uploadedFiles: any[] = [];

  questionCreationForm = new FormGroup({
    questionText: new FormControl('', Validators.required),
    subject: new FormControl({
      id: 0,
      name: ''
    }, Validators.required),
    difficulty: new FormControl(new Difficulty(''), Validators.required),
  });

  private questionApi = inject(QuestionApiService);
  private subjectApi = inject(SubjectApiService);

  constructor() { }

  ngOnInit() {

    this.subjectApi.getSubjects().subscribe(
      {
        next: (subjects) => { this.subjects = subjects; },
        error: (error) => { console.error('Error fetching subjects', error); }
      }
    );

    // TODO - check if it's worth to make an API call right here
    this.difficulties = [
      { id: 1, name: 'Fácil' },
      { id: 2, name: 'Média' },
      { id: 3, name: 'Difícil' },
    ]
  }

  onOptionsChanged(options: Option[]) {
    this.question.options = options;
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

  createQuestion(): void {
    // Check if the form is valid
    if (this.questionCreationForm.invalid) {
      return;
    }

    this.question.text = this.questionCreationForm.get('questionText')?.value || '';
    this.question.subjectId = this.questionCreationForm.get('subject')?.value?.id || 0;
    this.question.difficultyId = this.questionCreationForm.get('difficulty')?.value?.id || 0;

    this.questionApi.createQuestion(this.question).subscribe(
      {
        next: () => {
          console.log('Question created successfully');
        },
        error: (error) => {
          console.error('Error creating question', error);
        }
      }
    );
  }

}
