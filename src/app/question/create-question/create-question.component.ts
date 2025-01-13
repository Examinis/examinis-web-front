import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TextareaModule } from 'primeng/textarea';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { Subject } from '../../shared/models/subject';
import { Difficulty } from '../../shared/models/difficulty';

@Component({
  selector: 'app-create-question',
  imports: [PanelModule, ButtonModule, TextareaModule, ReactiveFormsModule, IftaLabelModule,
    SelectModule, FileUploadModule,
  ],
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.css'
})
export class CreateQuestionComponent implements OnInit {
  
  readonly maxChars = 200;
  subjects: Subject[] = [];
  difficulties: Difficulty[] = [];

  ngOnInit() {
    this.subjects = [
      { id: 1, name: 'Matemática' },
      { id: 2, name: 'Português' },
      { id: 3, name: 'Raciocínio Lógico' },
      { id: 4, name: 'Direito Administrativo' },
    ];

    this.difficulties = [
      { id: 1, name: 'Fácil' },
      { id: 2, name: 'Média' },
      { id: 3, name: 'Difícil' },
    ]
  }

  questionCreationForm = new FormGroup({
    questionText: new FormControl('', Validators.required),
    subject: new FormControl(new Subject(''), Validators.required),
    difficulty: new FormControl(new Difficulty(''), Validators.required),
  });
}
