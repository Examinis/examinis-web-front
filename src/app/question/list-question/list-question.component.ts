import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../shared/services/question.service';
import { Question } from '../../shared/models/question';
import { FormsModule } from '@angular/forms';
import { FilterCategoryPipe } from '../../shared/pipes/filter-category.pipe';
import { FilterDifficultyPipe } from '../../shared/pipes/filter-difficulty.pipe'; 

@Component({
  selector: 'app-question-list',
  templateUrl: './list-question.component.html',
  imports: [CommonModule, FormsModule, FilterCategoryPipe, FilterDifficultyPipe], 
  styleUrls: ['./list-question.component.css']
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  selectedDifficulty: string = ''; 

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.questionService.getQuestions().subscribe((data) => {
      this.questions = data;
      this.categories = [...new Set(data.map(q => q.categoria))];
    });
    console.log(this.questions);
  }

  toggleDifficulty(level: string): void {
    
    if (this.selectedDifficulty === level) {
      this.selectedDifficulty = '';
    } else {
      this.selectedDifficulty = level;
    }
  }
}
