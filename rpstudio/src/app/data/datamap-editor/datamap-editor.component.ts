import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FileLoaderComponent } from '../../file-loader/file-loader.component';
import { RPDatamap, RPFieldmap, RPDataType, RPParameterDef } from '../../shared/db-classes';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-datamap-editor',
  templateUrl: './datamap-editor.component.html',
  styleUrls: ['./datamap-editor.component.css']
})
export class DatamapEditorComponent implements OnInit {
  @Input()   datamap : RPDatamap;
  @Output()  saveDatamap    : EventEmitter<RPDatamap> = new EventEmitter<RPDatamap>();
  @Output()  cancelDatamap  : EventEmitter<RPDatamap> = new EventEmitter<RPDatamap>();

  newdm : RPDatamap = new RPDatamap();

  constructor() {
  }

  ngOnInit() {
  	//this.reset();
  }

  ngOnChanges() {
  	this.reset();
  }

  save() {
  	this.saveDatamap.emit(this.newdm);
  }

  cancel() {
  	this.cancelDatamap.emit();
  }

  reset() {
  }
  readFile(event) {
  	console.log(event);
  	this.save();
  }
  cancelFile() {
  	console.log("file load canceled");
  	this.cancel();
  }

}
