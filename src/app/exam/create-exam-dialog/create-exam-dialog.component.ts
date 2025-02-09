import { booleanAttribute, Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-create-exam-dialog',
  imports: [DialogModule, ButtonModule],
  templateUrl: './create-exam-dialog.component.html',
  styleUrl: './create-exam-dialog.component.css'
})
export class CreateExamDialogComponent {

  @Input({ required: true, transform: booleanAttribute }) visible: boolean = false;
  @Output() dialogClosed: EventEmitter<boolean> = new EventEmitter<boolean>();

  onDialogClose() {
    this.dialogClosed.emit(true);
  }
}
