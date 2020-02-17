import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuestionAnswersComponent } from './edit-question-answers.component';

describe('EditQuestionAnswersComponent', () => {
  let component: EditQuestionAnswersComponent;
  let fixture: ComponentFixture<EditQuestionAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditQuestionAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditQuestionAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
