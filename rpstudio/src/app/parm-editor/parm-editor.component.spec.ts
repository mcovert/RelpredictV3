import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParmEditorComponent } from './parm-editor.component';

describe('ParmEditorComponent', () => {
  let component: ParmEditorComponent;
  let fixture: ComponentFixture<ParmEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParmEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParmEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
