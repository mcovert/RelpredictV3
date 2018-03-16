import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { RPdatamap, RPFieldmap, RPDataType, RPParameterDef } from '../../shared/db-classes';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-datamap-editor',
  templateUrl: './datamap-editor.component.html',
  styleUrls: ['./datamap-editor.component.css']
})
export class DatamapEditorComponent implements OnInit {
  @Input()   datamap : RPDatamap;
  @Output()  save    : EventEmitter<RPDatamap> = new EventEmitter<RPDatamap>();
  @Output()  cancel  : EventEmitter<RPDatamap> = new EventEmitter<RPDatamap>();

  newdm : RPDatamap;

  constructor() {
  }

  ngOnInit() {
  	//this.reset();
  }

  ngOnChanges() {
  	this.reset();
  }

  save() {
  	this.save.emit(this.newdm);
  }

  cancel() {
  	this.cancel.emit();
  }

  reset() {
  }

}
