import { NgClass } from '@angular/common';
import { booleanAttribute, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ExamAutomaticCreate, ExamCreate, ExamManualCreate } from '../../shared/interfaces/exam/exam-create';
import { Subject } from '../../shared/interfaces/subject';

@Component({
  selector: 'app-create-exam-dialog',
  imports: [DialogModule, ButtonModule, InputNumberModule, FormsModule,
    SelectModule, InputTextModule, TextareaModule, MessageModule,
    ReactiveFormsModule, NgClass],
  templateUrl: './create-exam-dialog.component.html',
  styleUrl: './create-exam-dialog.component.css'
})
export class CreateExamDialogComponent {

  @Input({ required: true, transform: booleanAttribute }) visible: boolean = false;
  @Input({ required: true, transform: booleanAttribute }) isAutomaticGeneration: boolean = false;
  @Input({ required: true }) subjects: Subject[] = [];
  @Output() dialogClosed: EventEmitter<boolean> = new EventEmitter<boolean>();
  // This emitter means an automatic exam creation (no need to select questions manually)
  @Output() examSubmitted: EventEmitter<ExamAutomaticCreate> = new EventEmitter<
    ExamAutomaticCreate>();
  // This emitter means a basic info submitted (title, instructions and subject) for a manual
  // exam creation. You need to choose the questions manually
  @Output() basicInfoSubmitted: EventEmitter<ExamManualCreate> = new EventEmitter<
    ExamManualCreate>();
  // This event is emmitted when the user clicks on the "Choose questions" button in the dialog
  // to select the questions for the exam
  @Output() chooseQuestionsPressed: EventEmitter<Subject> = new EventEmitter<Subject>();

  selectedSubject?: Subject;

  examAutomaticCreateInfo: ExamCreate = { title: '', instructions: '', subject_id: 0, amount: 0,
    questions: []
  };
  examCreationForm = new FormGroup({
    title: new FormControl('', Validators.required),
    instructions: new FormControl(''),
    subject: new FormControl<Subject | null>(null, Validators.required),
    amount: new FormControl(5, [Validators.required, Validators.min(5), Validators.max(20)])
  });

  get title() { return this.examCreationForm.get('title'); }
  get instructions() { return this.examCreationForm.get('instructions'); }
  get subject() { return this.examCreationForm.get('subject'); }
  get amount() { return this.examCreationForm.get('amount'); }

  onDialogClose() {
    this.dialogClosed.emit(true);
  }

  // TODO - validate createExam and createExamAutomatically methods
  /**
   * Handles the submission of the exam creation dialog.
   * 
   * This method performs the following actions:
   * 1. Marks all fields in the exam creation form as touched to display any validation error messages.
   * 2. Checks if the form is valid. If the form is invalid, the method returns early.
   * 3. Depending on the value of `isAutomaticGeneration`, it either emits an automatic exam creation event or a manual exam creation event.
   * 4. Closes the dialog.
   * 
   * @returns {void}
   */
  onCreateDialogSubmit(): void {
    // Mark all fields as touched to show the error messages if the form is invalid
    this.examCreationForm.markAllAsTouched();
    // Check if the form is valid
    if (this.examCreationForm.invalid) { return; }

    if (this.isAutomaticGeneration) {
      this.emitAutomaticExamCreation();
    } else {
      this.emitManualExamCreation();
      this.chooseQuestionsPressed.emit(
        this.examCreationForm.value.subject || {id: 0, name: ''});
    }

    this.onDialogClose();
  }

  private emitAutomaticExamCreation() {
    this.examSubmitted.emit({
      title: this.examCreationForm.value.title || '',
      instructions: this.examCreationForm.value.instructions || '',
      subject_id: this.examCreationForm.value.subject?.id || 0,
      amount: this.examCreationForm.value.amount || 0
    } as ExamAutomaticCreate);
  }

  private emitManualExamCreation() {
    this.basicInfoSubmitted.emit({
      title: this.examCreationForm.value.title || '',
      instructions: this.examCreationForm.value.instructions || '',
      subject_id: this.examCreationForm.value.subject?.id || 0,
      questions: []
    } as ExamManualCreate);
  }
}
