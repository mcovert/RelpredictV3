import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FileLoaderComponent } from '../../file-loader/file-loader.component';
import { RPDatamap, RPFieldmap, RPDataType, RPParameterDef } from '../../shared/db-classes';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { DataService } from '../../services/data.service';

/*
*   Mode - load from file (csv)
*          create new datamap
*          edit existing
*          display existing (no edit)
*/

@Component({
  selector: 'app-datamap-editor',
  templateUrl: './datamap-editor.component.html',
  styleUrls: ['./datamap-editor.component.css']
})
export class DatamapEditorComponent implements OnInit {
  @Input()   mode    : string;     // file, edit, display
  @Input()   datamap : RPDatamap;
  @Output()  saveDatamap    : EventEmitter<RPDatamap> = new EventEmitter<RPDatamap>();
  @Output()  cancelDatamap  : EventEmitter<RPDatamap> = new EventEmitter<RPDatamap>();

  newdm : RPDatamap = new RPDatamap();
  dataTypes : RPDataType[];
  datamapTypes: string[];

  constructor(private globalService: GlobalService, private dataService: DataService ) {
  	this.dataTypes = globalService.getDataTypes();
  	this.datamapTypes = dataService.getDatamapTypes();
  }

  ngOnInit() {
  	//this.reset();
  }

  ngOnChanges() {
  	this.newdm = this.datamap;
  	console.log(this.newdm);
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
  	this.newdm = new RPDatamap();
  	//this.newdm.fields.splice(1, 0);
  	var lines = event.split('\n');
  	var cols = lines[0].split(',');
  	for (var col of cols) {
  		console.log(col);
  		let fm = new RPFieldmap();
  		fm.fieldmap_name = col;
  		fm.fieldmap_type = this.dataTypes[0].datatype_name;
  		this.newdm.fields.push(fm);
  	}
  	console.log(this.newdm);
  }
  cancelFile() {
  	this.cancel();
  }
  newField() {
  	this.newdm.fields.push(new RPFieldmap());
  }
  isDisplay() {
  	return this.mode === 'display';
  }
  isFile() {
  	return this.mode === 'file';
  }
}
