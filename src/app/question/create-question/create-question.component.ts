import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-create-question',
  imports: [CardModule, ButtonModule, TextareaModule, ReactiveFormsModule, IftaLabelModule],
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.css'
})
export class CreateQuestionComponent {
  readonly maxChars = 200;

  questionCreationForm = new FormGroup({
    questionText: new FormControl('', Validators.required),
  });
}
