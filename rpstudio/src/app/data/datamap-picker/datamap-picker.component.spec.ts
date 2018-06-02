import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatamapPickerComponent } from './datamap-picker.component';

describe('DatamapPickerComponent', () => {
  let component: DatamapPickerComponent;
  let fixture: ComponentFixture<DatamapPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatamapPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatamapPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
