import { Component, inject, Input, OnInit } from '@angular/core';
import { Question } from '../../shared/interfaces/question';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { Option } from '../../shared/interfaces/option';
import { ButtonModule } from 'primeng/button';
import { QuestionApiService } from '../../shared/services/question-api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-question-details',
  imports: [PanelModule, TagModule, ImageModule, ListboxModule, FormsModule, ButtonModule,
    CommonModule, ProgressSpinner
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
        console.log(q)
        this.question = q;
        this.correctOption = q.options.find(o => o.isCorrect) || 
          {description: '', letter: '', isCorrect: false };
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
