import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndFormComponent } from './end-form.component';

describe('EndFormComponent', () => {
  let component: EndFormComponent;
  let fixture: ComponentFixture<EndFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
