import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { ListboxModule } from 'primeng/listbox';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { Option } from '../../shared/interfaces/option';
import { Question } from '../../shared/interfaces/question';
import { QuestionApiService } from '../../shared/services/question-api.service';
import { SidebarDrawerComponent } from '../../shared/components/sidebar-drawer/sidebar-drawer.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-question-details',
  imports: [PanelModule, TagModule, ImageModule, ListboxModule, FormsModule, ButtonModule,
    CommonModule, ProgressSpinner, SidebarDrawerComponent
  ],
  templateUrl: './question-details.component.html',
  styleUrl: './question-details.component.css'
})
export class QuestionDetailsComponent implements OnInit {

  question: Question = {
    text: '',
    subject: { name: '' },
    difficulty: { name: '' },
    user: {
      firstName: '',
      lastName: ''
    },
    options: []
  };
  correctOption: Option = { description: '', letter: '', isCorrect: false };
  loading = true;

  private questionApiService: QuestionApiService = inject(QuestionApiService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor(private router: Router) { }

  goTo(page: string): void {
    this.router.navigate(['/' + page]);
  }

  ngOnInit(): void {
    // Get the question ID from the URL and load the question details
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadQuestionDetails(+id); // Convert the ID to a number
      }
    });
  }

  private loadQuestionDetails(id: number) {
    this.loading = true;
    this.questionApiService.getQuestionById(id).subscribe({
      next: (q) => {
        this.question = q;
        this.correctOption = q.options.find(o => o.isCorrect) ||
          { description: '', letter: '', isCorrect: true };
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar questão:', error);
        this.loading = false;
      }
    });
  }

  getDifficultyClass(difficulty: string | undefined): 'success' | 'secondary' | 'warn' | 'danger' |
    undefined {

    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warn';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  }

}
