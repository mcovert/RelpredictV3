import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { RPParameter, RPParameterDef, RPTargetAlgorithm, RPAlgorithmDef } from '../../shared/db-classes';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-alg-editor',
  templateUrl: './alg-editor.component.html',
  styleUrls: ['./alg-editor.component.css']
})
export class AlgEditorComponent implements OnInit {

  @Input()   alg             : RPTargetAlgorithm;
  @Output()  saveAlgorithm   : EventEmitter<RPTargetAlgorithm> = new EventEmitter<RPTargetAlgorithm>();
  @Output()  cancelAlgorithm : EventEmitter<RPTargetAlgorithm> = new EventEmitter<RPTargetAlgorithm>();

  algDefs     : RPAlgorithmDef[];
  newalg      : RPTargetAlgorithm = new RPTargetAlgorithm();
  curr_algdef : RPAlgorithmDef;
  algname     : string;

  constructor(private modelService : ModelService) {
  	this.algDefs = this.modelService.getAlgorithmDefs();
    this.curr_algdef = this.algDefs[0];
    this.newalg = this.modelService.createTargetAlgorithm(this.curr_algdef); 
  }

  ngOnInit() {
  	//this.reset();
  }

  ngOnChanges() {
  	this.reset();
  }

  save() {
  	this.saveAlgorithm.emit(this.newalg);
  }

  cancel() {
  	this.cancelAlgorithm.emit();
  }

  reset() {
    if (this.alg == null) return;
  	this.newalg = this.alg.clone();
    this.curr_algdef = this.modelService.getAlgorithmDef(this.newalg.name);
    this.algname = this.newalg.name;
  }

  setAlgorithmDef(algName : string) {
  	if (algName == this.alg.name)
  		this.reset();
    else {
    	this.curr_algdef = this.modelService.getAlgorithmDef(algName);
    	this.newalg = this.modelService.createTargetAlgorithm(this.curr_algdef); 
    }
  }

}
