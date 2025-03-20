import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubjectApiService } from '../../shared/services/subject-api.service';
import { Subject } from '../../shared/interfaces/subject';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ExamApiService } from '../../shared/services/exam-api.service';
import { Router } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';


@Component({
  selector: 'app-create-exam-automatic',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AutoCompleteModule, 
    ButtonModule, SelectModule, MessageModule, InputNumberModule, InputTextModule, TextareaModule],
  templateUrl: './create-exam-automatic.component.html',
  styleUrl: './create-exam-automatic.component.css'
})
export class CreateExamAutomaticComponent {
  createForm: FormGroup;
  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  selectedSubject: Subject | null = null;

  constructor(private subjectService: SubjectApiService, 
    private examService: ExamApiService, private router: Router) {
    this.createForm = new FormGroup({
      title: new FormControl('', Validators.required),
      instructions: new FormControl(''),
      subject: new FormControl<Subject | null>(null, Validators.required),
      amount: new FormControl(5, [Validators.required, Validators.min(5), Validators.max(20)])
    });
  }

  get subject() { return this.createForm.get('subject'); }
  get title() { return this.createForm.get('title'); }
  get instructions() { return this.createForm.get('instructions'); }
  get amount() { return this.createForm.get('amount'); }

  ngOnInit(): void {
    this.fetchSubjects();
  }

  fetchSubjects(): void {
    this.subjectService.getSubjects().subscribe(subjects => this.subjects = subjects);
  }

  searchSubject(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredSubjects = this.subjects.filter(subject =>
      subject.name.toLowerCase().includes(query)
    );
  }

  onSubjectSelect(event: AutoCompleteSelectEvent): void {
    const subject: Subject = event.value;
    this.selectedSubject = subject;
    this.createForm.patchValue({ subject: subject });
  }

  onSubmit(): void {
    if (this.createForm.valid) {
      const formData = this.createForm.value;
      const payload = {
        ...formData,
        subject_id: formData.subject?.id || null,
      };
      delete payload.subject;

      console.log('Form data to send:', formData);
      this.examService.createExamAutomatically(payload).subscribe({
        next: () => {
          console.log('Exam created successfully');
          this.router.navigate(['/exams']);
        },
        error: (error) => {
          console.error('Error creating exam:', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  onReset() {
    this.createForm.reset({ amount: 5 });
    this.selectedSubject = null;
    this.filteredSubjects = [];
  }
}
