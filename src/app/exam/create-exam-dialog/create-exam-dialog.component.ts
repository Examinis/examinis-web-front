import { booleanAttribute, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ExamCreate } from '../../shared/interfaces/exam/exam-create';
import { Subject } from '../../shared/interfaces/subject';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-create-exam-dialog',
  imports: [DialogModule, ButtonModule, InputNumberModule, FormsModule,
    SelectModule, InputTextModule, TextareaModule,],
  templateUrl: './create-exam-dialog.component.html',
  styleUrl: './create-exam-dialog.component.css'
})
export class CreateExamDialogComponent implements OnInit {

  @Input({ required: true, transform: booleanAttribute }) visible: boolean = false;
  @Input({ required: true }) subjects: Subject[] = [];
  @Output() dialogClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  examCreateInfo: ExamCreate = { title: '', instructions: '', subject_id: 0, amount: 0 };
  
  selectedSubject?: Subject;

  numberOfQuestions: number = 10;

  ngOnInit(): void {
    
  }

  onDialogClose() {
    this.dialogClosed.emit(true);
  }
}
