import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatafileViewerComponent } from './datafile-viewer.component';

describe('DatafileViewerComponent', () => {
  let component: DatafileViewerComponent;
  let fixture: ComponentFixture<DatafileViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatafileViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatafileViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
