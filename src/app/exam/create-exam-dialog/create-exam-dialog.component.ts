import { booleanAttribute, Component, EventEmitter, Input, Output } from '@angular/core';
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
export class CreateExamDialogComponent {

  @Input({ required: true, transform: booleanAttribute }) visible: boolean = false;
  @Output() dialogClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  examCreateInfo: ExamCreate = { title: '', instructions: '', subject_id: 0, amount: 0 };
  
  subjects: Subject[] = [
    { id: 1, name: 'Matemática' },
    { id: 2, name: 'Português' },
    { id: 3, name: 'História' },
    { id: 4, name: 'Geografia' },
    { id: 5, name: 'Inglês' },
    { id: 6, name: 'Biologia' },
    { id: 7, name: 'Química' },
    { id: 8, name: 'Física' },
    { id: 9, name: 'Filosofia' },
    { id: 10, name: 'Sociologia' },
    { id: 11, name: 'Artes' },
    { id: 12, name: 'Educação Física' },
  ];
  selectedSubject?: Subject;

  numberOfQuestions: number = 10;

  onDialogClose() {
    this.dialogClosed.emit(true);
  }
}
