import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExamAutomaticComponent } from './create-exam-automatic.component';

describe('CreateExamAutomaticComponent', () => {
  let component: CreateExamAutomaticComponent;
  let fixture: ComponentFixture<CreateExamAutomaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateExamAutomaticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateExamAutomaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
