import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowQuestionUserComponent } from './show-question-user.component';

describe('ShowQuestionUserComponent', () => {
  let component: ShowQuestionUserComponent;
  let fixture: ComponentFixture<ShowQuestionUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowQuestionUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowQuestionUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
