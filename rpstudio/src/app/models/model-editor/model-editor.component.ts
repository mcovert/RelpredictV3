import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { GlobalService } from '../../services/global.service';
import { RPModel, RPFeature, RPTarget, RPModelClass, RPModelTemplate, RPDataType, RPFieldTemplate } from '../../shared/db-classes';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-model-editor',
  templateUrl: './model-editor.component.html',
  styleUrls: ['./model-editor.component.css']
})
export class ModelEditorComponent implements OnInit {

  @Input() modelTemplate : RPModelTemplate;

  dataTypes      : RPDataType[];
  modelClasses   : RPModelClass[];
  newModel       : RPModel;

  constructor(private modelService: ModelService, private globalService : GlobalService) { 
    this.modelService.getModelClasses().subscribe(resultArray => {
        this.modelClasses = resultArray as RPModelClass[];
    });
    this.dataTypes = this.globalService.getDataTypes();

  }

  ngOnInit() {
  }
  ngOnchanges() {
  }
  addColumn() {
  	let ft = new RPFieldTemplate();
  	ft.field_type = "Feature";
  	ft.field_name = "field-" + this.modelTemplate.fields.length;
  	ft.field_datatype = this.dataTypes[0].datatype_name;
  	ft.field_label = "";
  	this.modelTemplate.fields.push(ft);
  }
  deleteColumn(i : number) {
  	this.modelTemplate.fields.splice(i, 1);
  }
  saveModel() {
  	this.newModel = new RPModel();
  }
  cancelModel() {}
}
