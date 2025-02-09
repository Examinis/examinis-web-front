import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-create-exam-dialog',
  imports: [DialogModule, ButtonModule],
  templateUrl: './create-exam-dialog.component.html',
  styleUrl: './create-exam-dialog.component.css'
})
export class CreateExamDialogComponent {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
}
