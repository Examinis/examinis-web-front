import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubjectApiService } from '../../shared/services/subject-api.service';
import { Subject } from '../../shared/interfaces/subject';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ExamApiService } from '../../shared/services/exam-api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-exam-automatic',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AutoCompleteModule, ButtonModule],
  templateUrl: './create-exam-automatic.component.html',
  styleUrl: './create-exam-automatic.component.css'
})
export class CreateExamAutomaticComponent {
  createForm: FormGroup;
  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  selectedSubject: Subject | null = null;

  constructor(private fb: FormBuilder, private subjectService: SubjectApiService, private examService: ExamApiService, private router: Router) {
    this.createForm = this.fb.group({
      title: ['', [Validators.required]],
      instructions: ['', [Validators.maxLength(500)]],
      subject: new FormControl(null, Validators.required),
      amount: [5, [Validators.required, Validators.min(5), Validators.max(20)]],
    });
  }

  get subjectControl(): FormControl {
    return this.createForm.get('subject') as FormControl;
  }

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
