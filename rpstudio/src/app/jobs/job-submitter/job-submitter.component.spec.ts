import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSubmitterComponent } from './job-submitter.component';

describe('JobSubmitterComponent', () => {
  let component: JobSubmitterComponent;
  let fixture: ComponentFixture<JobSubmitterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSubmitterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSubmitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
