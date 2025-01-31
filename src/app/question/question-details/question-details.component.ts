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

@Component({
  selector: 'app-question-details',
  imports: [PanelModule, TagModule, ImageModule, ListboxModule, FormsModule, ButtonModule,
    CommonModule
  ],
  templateUrl: './question-details.component.html',
  styleUrl: './question-details.component.css'
})
export class QuestionDetailsComponent implements OnInit {

  question: Question = {
    text: '',
    subject: { name: '' },
    difficulty: { name: '' },
    options: []
  };
  correctOption: Option = { description: '', letter: '', isCorrect: false};

  private questionApiService: QuestionApiService = inject(QuestionApiService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    // Capturar o ID da URL e carregar a questão
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadQuestionDetails(+id); // Convertendo para número e buscando a questão
      }
    });
  }

  private loadQuestionDetails(id: number) {
    this.questionApiService.getQuestionById(id).subscribe({
      next: (q) => {
        this.question = q;
        this.correctOption = q.options.find(o => o.isCorrect) || { description: '', letter: '', isCorrect: false };
      },
      error: (error) => {
        console.error('Erro ao carregar questão:', error);
      }
    });
  }

  getDifficultyClass(difficulty: string | undefined): 'success' | 'secondary' | 'warn' | 'danger' |
    undefined {

    switch (difficulty?.toLowerCase()) {
      case 'fácil': return 'success';
      case 'médio': return 'warn';
      case 'difícil': return 'danger';
      default: return 'secondary';
    }
  }

}
