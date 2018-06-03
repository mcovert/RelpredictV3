import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-model-view-dialog',
  templateUrl: './model-view-dialog.component.html',
  styleUrls: ['./model-view-dialog.component.css']
})
export class ModelViewDialogComponent implements OnInit {

  @Input() model;
  @Input() mode;
  @Output() closeDialog : EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }
  close() {
  	this.closeDialog.emit("");
  }

}
