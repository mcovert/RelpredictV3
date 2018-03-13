import { Component, OnInit, Injectable } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { RPDataType, RPParameter, RPParameterDef, RPFeature, RPTargetAlgorithm, RPTarget, RPModel, RPAlgorithmDef, RPCurrentModel, RPLogEntry, RPTrainedModel,
         RPModelClass } from '../../shared/db-classes';
import { NgForm } from '@angular/forms';

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
  showAlg      : boolean = false;
  content      : RPParameterDef[];
  f_or_t       : string;
  curr_index   : number;
  curr_type    : string;
  parm_storage : RPParameter[];

  constructor(private modelService : ModelService, private router: Router /* , private modalService: ModalService*/) { 
  }

  ngOnInit() {
    this.modelService.getModelClasses().subscribe(resultArray => {
        this.modelClasses = resultArray as RPModelClass[];
    });
    this.dataTypes = this.modelService.getDataTypes();
    console.log(this.dataTypes);
    this.algDefs = this.modelService.getAlgorithmDefs();
    console.log(this.algDefs);
    this.model = new RPModel();
    this.model.version = 1;
    this.model.features = [];
    this.model.targets = [];
    this.model.notes = [];
    this.addFeature();
    this.addTarget();
    console.log(this.model);
  }
  getParms(dt: string) : RPDataType {
    console.log("Looking for data type " + dt);
    for (var dtype of this.dataTypes) {
      if (dtype.datatype_name == dt)
         return dtype;
    }
    return this.dataTypes[0];
  }
  getAlg(algname: string) : RPAlgorithmDef {
    console.log("Looking for algorithm " + alg);
    for (var alg of this.algDefs) {
      if (alg.name == algname)
         return alg;
    }
    return this.algDefs[0];
  }
  setupStorage(plist: RPParameterDef[]) {
    console.log(plist);
    this.parm_storage = [];
    for (var p of plist) {
      this.parm_storage.push({ parm_name: p.parm_name, parm_value: p.parm_default, parm_type: p.data_type});
    }
  }
  addFeature() {
    console.log("Adding new feature");
    var feature = new RPFeature();
    feature.parms = [];
    feature.type = this.dataTypes[0].datatype_name;
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
    target.algorithms.push();
    target.parms = [];
    target.type = this.dataTypes[0].datatype_name;
    this.model.targets.push(target);
    console.log(this.model);
  }
  deleteTarget(i : number) {
    console.log("Deleting target");
    this.model.targets.splice(i, 1);
  }
  changeFeatureDataType(dt: string, i: number) {
    console.log("setting feature " + i + " to " + dt);
    this.model.features[i].type = dt;
  }
  changeTargetDataType(dt: string, i: number) {
    this.model.targets[i].type = dt;
  }
  changeAlgorithm(alg: string) {
    this.content = this.getAlg(alg).parms;
  }
  showParmEditor(dt : string, f_or_t: string, i: number) {
    this.content = this.getParms(dt).parms;
    if (f_or_t == 'feature' && this.model.features[i].parms.length > 0) {
        this.parm_storage = this.model.features[i].parms;
    }
    else if (f_or_t == 'target' && this.model.targets[i].parms.length > 0) 
        this.parm_storage = this.model.targets[i].parms;
    else {
        this.setupStorage(this.content);
    }
    console.log(this.parm_storage);
    this.curr_type = f_or_t;
    this.curr_index = i;
    this.showParm = true;
  }
  showAlgEditor() {
    this.content = this.algDefs[0].parms;
    this.showAlg = true;
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
  saveParmDialog() {
    if (this.curr_type == 'feature') this.model.features[this.curr_index].parms = this.parm_storage;
    else if (this.curr_type == 'target') this.model.targets[this.curr_index].parms = this.parm_storage;
    console.log(this.parm_storage);
    this.showParm = false; 
  }
  cancelParmDialog() {
    console.log(this.parm_storage);
    this.showParm = false;
  }
  resetParmDialog() {
    console.log(this.parm_storage);
  }
  saveAlgDialog() {
    this.showAlg  = false;   
  }
  cancelAlgDialog() {
    this.showAlg  = false;   
  }
  resetAlgDialog() {
  }
  trackByIndex(index: number, value: number) {
    console.log(index);
    return index;
  }
}
