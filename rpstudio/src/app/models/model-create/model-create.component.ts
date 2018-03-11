import { Component, OnInit, Injectable } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { RPDataType, RPParameter, RPFeature, RPTargetAlgorithm, RPTarget, RPModel, RPAlgorithmDef, RPCurrentModel, RPLogEntry, RPTrainedModel,
         RPModelClass } from '../../shared/db-classes';

@Component({
  selector: 'app-model-create',
  templateUrl: './model-create.component.html',
  styleUrls: ['./model-create.component.css']
})
export class ModelCreateComponent implements OnInit {

  model        : RPModel = new RPModel();
  modelClasses : RPModelClass[];
  dataTypes    : RPDataType[];
  algDefs      : RPAlgorithmDef[];
  showParm     : boolean = false;
  showAlg     : boolean = false;
  content      : any;

  constructor(private modelService : ModelService, private router: Router /* , private modalService: ModalService*/) { 
  }

  ngOnInit() {
    this.modelService.getModelClasses().subscribe(resultArray => {
        this.modelClasses = resultArray as RPModelClass[];
    });
    this.model = new RPModel();
    this.model.version = 1;
    this.model.features = [];
    this.model.targets = [];
    this.model.notes = [];
    this.addFeature();
    this.addTarget();
    console.log(this.model);

    this.modelService.getDataTypes().subscribe(resultArray => {
        this.dataTypes = resultArray as RPDataType[];
        console.log(this.dataTypes);
    })
    this.modelService.getAlgorithmDefs().subscribe(resultArray => {
        this.algDefs = resultArray as RPAlgorithmDef[];
        console.log(this.algDefs);
    })
  }

  addFeature() {
    console.log("Adding new feature");
    var feature = new RPFeature();
    feature.parms = [];
    feature.isTarget = false;
    this.model.features.push(feature);
    console.log(this.model);
  }
  deleteFeature(i : number) {
    console.log("Deleting feature");
    this.model.features.splice(i, 1);
  }
  addTarget() {
    console.log("Adding new feature");
    var target = new RPTarget();
    target.algorithms = [];
    target.parms = [];
    this.model.targets.push(target);
    console.log(this.model);
  }
  deleteTarget(i : number) {
    console.log("Deleting target");
    this.model.targets.splice(i, 1);
  }
  showParmEditor(i : number) {
    this.content = [ { parm_name: "encode", parm_values: [ "category", "one-hot" ]},
                     { parm_name: "delimiter", parm_values: [ "comma", "pipe", "tab", "spaces"] },
                     { parm_name: "scale", parm_values: [ "none", "min-max"]}];
    this.showParm = true;
  }
  saveModel() {
  	console.log("Model saved");
  	console.log(this.model);
    this.router.navigate(['models']);
  }
  cancelModel() {
    if (confirm("Are you sure you want to discard this model?")) {
       console.log("Model canceled");
       this.router.navigate(['models']);      
    }
  }
  saveDialog() {
    this.showParm = false;    
  }
  cancelDialog() {
    this.showParm = false;
  }
  resetDialog() {
    
  }
  trackByIndex(index: number, value: number) {
    console.log(index);
    return index;
  }
}
