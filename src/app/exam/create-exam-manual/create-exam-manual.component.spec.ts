import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExamManualComponent } from './create-exam-manual.component';

describe('CreateExamManualComponent', () => {
  let component: CreateExamManualComponent;
  let fixture: ComponentFixture<CreateExamManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateExamManualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateExamManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
