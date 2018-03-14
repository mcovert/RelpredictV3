import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgEditorComponent } from './alg-editor.component';

describe('AlgEditorComponent', () => {
  let component: AlgEditorComponent;
  let fixture: ComponentFixture<AlgEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlgEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
