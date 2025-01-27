import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { QuestionListComponent } from './question/list-question/list-question.component';

const COMPONENTS = [QuestionListComponent];

@Component({
  selector: 'app-root',
  imports: [COMPONENTS],
  template: `<main>
  <header class="brand-name">
  </header>
  <section class="content">
    <app-question-list></app-question-list>
  </section>
</main>`,
  styleUrls: ['./app.component.css'],
  
})
export class AppComponent { 
  title = 'default';
}
