import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionListComponent } from './list-question.component';

describe('QuestionListComponent', () => {
  let component: QuestionListComponent;
  let fixture: ComponentFixture<QuestionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
