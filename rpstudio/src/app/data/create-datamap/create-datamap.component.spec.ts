import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDatamapComponent } from './create-datamap.component';

describe('CreateDatamapComponent', () => {
  let component: CreateDatamapComponent;
  let fixture: ComponentFixture<CreateDatamapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDatamapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDatamapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
