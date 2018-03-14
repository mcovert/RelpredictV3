import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { RPParameter, RPParameterDef } from '../shared/db-classes';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-parm-editor',
  templateUrl: './parm-editor.component.html',
  styleUrls: ['./parm-editor.component.css']
})
export class ParmEditorComponent implements OnInit {

  @Input()   parmDefs    : RPParameterDef[];
  @Input()   parms       : RPParameter[];
  @Output()  saveParms   : EventEmitter<RPParameter[]> = new EventEmitter<RPParameter[]>();
  @Output()  cancelParms : EventEmitter<RPParameter[]> = new EventEmitter<RPParameter[]>();
 
  newparms : RPParameter[];

  constructor() { }

  ngOnInit() {
  	console.log(this.parmDefs);
  	console.log(this.parms);
  	this.reset();
  }

  ngOnChanges() {
  	console.log(this.parmDefs);
  	console.log(this.parms);
  	this.reset();
  }

  save() {
  	this.saveParms.emit(this.newparms);
  }

  cancel() {
  	this.cancelParms.emit();
  }

  reset() {
  	this.newparms = [];
  	for (var p of this.parms) {
  		this.newparms.push(p.clone());
  	}
  }

}
