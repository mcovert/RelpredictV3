import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FileLoaderComponent } from '../../file-loader/file-loader.component';
import { RPDatamap, RPFieldmap, RPDataType, RPParameterDef } from '../../shared/db-classes';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { DataService } from '../../services/data.service';

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
  newField() {
  	this.newdm.fields.push(new RPDatamap());
  }
}
