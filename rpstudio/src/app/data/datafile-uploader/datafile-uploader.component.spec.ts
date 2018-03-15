import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatafileUploaderComponent } from './datafile-uploader.component';

describe('DatafileUploaderComponent', () => {
  let component: DatafileUploaderComponent;
  let fixture: ComponentFixture<DatafileUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatafileUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatafileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
