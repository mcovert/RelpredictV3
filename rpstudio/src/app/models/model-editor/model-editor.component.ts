import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { RPModel, RPFeature, RPTarget, RPModelClass } from '../../shared/db-classes';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-model-editor',
  templateUrl: './model-editor.component.html',
  styleUrls: ['./model-editor.component.css']
})
export class ModelEditorComponent implements OnInit {

  @Input() model : RPModel;

  modelClasses   : RPModelClass[];

  constructor(private modelService: ModelService) { 
    this.modelService.getModelClasses().subscribe(resultArray => {
        this.modelClasses = resultArray as RPModelClass[];
    });

  }

  ngOnInit() {
  }
  ngOnchanges() {
    this.model.model_class = this.modelClasses[0].label;
    this.model.version = 1;
    this.model.features = [];
    this.model.targets = [];
    this.model.notes = [];
    this.model.description = "";
    this.model.identifier = "";
    this.model.current = false; 	
  }
  addColumn() {
  	this.model.features.push(new RPFeature());
  }

}
