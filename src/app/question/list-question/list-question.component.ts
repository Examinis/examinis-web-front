import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../shared/services/question.service';
import { Question } from '../../shared/models/question';

@Component({
  selector: 'app-question-list',
  templateUrl: './list-question.component.html',
  imports: [CommonModule],
  styleUrls: ['./list-question.component.css']
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.questionService.getQuestions().subscribe((data) => {
      this.questions = data;
    });
  }
}
