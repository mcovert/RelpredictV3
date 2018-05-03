import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatypeSelectorComponent } from './datatype-selector.component';

describe('DatatypeSelectorComponent', () => {
  let component: DatatypeSelectorComponent;
  let fixture: ComponentFixture<DatatypeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatypeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
