import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TextareaModule } from 'primeng/textarea';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
import { FileUpload } from 'primeng/fileupload';
import { Subject } from '../../shared/models/subject';
import { Difficulty } from '../../shared/models/difficulty';
import { OptionSelectComponent } from "./option-select/option-select.component";
import { QuestionApiService } from '../../shared/services/question-api.service';
import { Option } from '../../shared/interfaces/option';
import { Question } from '../../shared/interfaces/question';
import { SubjectApiService } from '../../shared/services/subject-api.service';

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

  readonly maxChars = 200;
  subjects: Subject[] = [];
  difficulties: Difficulty[] = [];
  uploadedFiles: any[] = [];

  questionCreationForm = new FormGroup({
    questionText: new FormControl('', Validators.required),
    subject: new FormControl(new Subject(''), Validators.required),
    difficulty: new FormControl(new Difficulty(''), Validators.required),
  });

  selectedOption: any;

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

  selectOption(option: Option) {
    console.log(option);
    this.selectedOption = option;
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

    // const question: Question = {
    //   id: undefined,
    //   text: this.questionCreationForm.get('questionText').value,
    //   subject: this.questionCreationForm.get('subject').value,
    //   difficulty: this.questionCreationForm.get('difficulty').value,
    //   options: this.selectedOption
    // };
    const question: Question = {
      id: undefined,
      text: this.questionCreationForm.get('questionText')?.value || '',
      subject: this.questionCreationForm.get('subject')?.value || { id: 0, name: '' },
      difficulty: this.questionCreationForm.get('difficulty')?.value || { id: 0, name: '' },
      options: this.selectedOption
    };

    this.questionApi.createQuestion(question).subscribe(
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
