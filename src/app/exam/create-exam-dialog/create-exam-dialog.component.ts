import { NgClass } from '@angular/common';
import { booleanAttribute, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ExamCreate } from '../../shared/interfaces/exam/exam-create';
import { Subject } from '../../shared/interfaces/subject';
import { ExamApiService } from '../../shared/services/exam-api.service';

@Component({
  selector: 'app-create-exam-dialog',
  imports: [DialogModule, ButtonModule, InputNumberModule, FormsModule,
    SelectModule, InputTextModule, TextareaModule, MessageModule,
    ReactiveFormsModule, NgClass],
  templateUrl: './create-exam-dialog.component.html',
  styleUrl: './create-exam-dialog.component.css'
})
export class CreateExamDialogComponent implements OnInit {

  private examApiService: ExamApiService = inject(ExamApiService);

  @Input({ required: true, transform: booleanAttribute }) visible: boolean = false;
  @Input({ required: true, transform: booleanAttribute }) isAutomaticGeneration: boolean = false;
  @Input({ required: true }) subjects: Subject[] = [];
  @Output() dialogClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedSubject?: Subject;

  examCreateInfo: ExamCreate = { title: '', instructions: '', subject_id: 0, amount: 0 };
  examCreationForm = new FormGroup({
    title: new FormControl('', Validators.required),
    instructions: new FormControl(''),
    subject: new FormControl({
      id: 0,
      name: ''
    } as Subject, Validators.required),
    amount: new FormControl(5, [Validators.required, Validators.min(5), Validators.max(20)])
  });

  get title() { return this.examCreationForm.get('title'); }
  get instructions() { return this.examCreationForm.get('instructions'); }
  get subject() { return this.examCreationForm.get('subject'); }
  get amount() { return this.examCreationForm.get('amount'); }

  ngOnInit(): void {

  }

  onDialogClose() {
    this.dialogClosed.emit(true);
  }

  // TODO - validate createExam and createExamAutomatically methods
  createExam() {

    // Mark all fields as touched to show the error messages if the form is invalid
    this.examCreationForm.markAllAsTouched();

    // Check if the form is valid
    if (this.examCreationForm.invalid) { return; }

    const examCreationInfoToSend: ExamCreate = {
      title: this.examCreationForm.value.title || '',
      instructions: this.examCreationForm.value.instructions || '',
      subject_id: this.examCreationForm.value.subject?.id || 0,
      amount: this.examCreationForm.value.amount || 0
    };

    this.createExamAutomatically(examCreationInfoToSend);
  }

  private createExamAutomatically(exam: ExamCreate) {
    this.examApiService.createExamAutomatically(exam).subscribe((exam) => {
      this.onDialogClose();
      console.log(exam);
    });
  }

}
