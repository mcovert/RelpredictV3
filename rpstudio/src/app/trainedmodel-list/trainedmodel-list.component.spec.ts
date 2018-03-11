import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainedmodelListComponent } from './trainedmodel-list.component';

describe('TrainedmodelListComponent', () => {
  let component: TrainedmodelListComponent;
  let fixture: ComponentFixture<TrainedmodelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainedmodelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainedmodelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
