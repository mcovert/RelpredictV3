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
  curr_index2  : number;
  curr_type    : string;
  parm_storage : RPParameter[];
  curr_alg     : RPAlgorithmDef;
  curr_alg_name : string;
  alg          : RPTargetAlgorithm;

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
    this.alg = this.model.targets[0].algorithms[0];
    console.log(this.alg);
    console.log(this.model);
  }
  getParms(dt: string) : RPDataType {
    for (var dtype of this.dataTypes) {
      if (dtype.datatype_name == dt)
         return dtype;
    }
    return this.dataTypes[0];
  }
  getAlg(algname: string) : RPAlgorithmDef {
    for (var alg of this.algDefs) {
      if (alg.name == algname)
         return alg;
    }
    return this.algDefs[0];
  }
  getAlgByShortName(algname: string) : RPAlgorithmDef {
    for (var alg of this.algDefs) {
      if (alg.short_name == algname)
         return alg;
    }
    return this.algDefs[0];
  }
  setupStorage(plist: RPParameterDef[]) {
    this.parm_storage = [];
    for (var p of plist) {
      var parm = new RPParameter(p.parm_name, p.parm_default, p.data_type);
      this.parm_storage.push(parm);
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
  makeAlgorithm(algd: RPAlgorithmDef) : RPTargetAlgorithm {
    var ta = new RPTargetAlgorithm();
    ta.short_name = algd.short_name;
    ta.description = algd.description;
    ta.parms = [];
    for (var p of algd.parms) {
      var ap = new RPParameter(p.parm_name, p.parm_default, p.data_type);
      ta.parms.push(ap);
    }
    return ta;
  }
  addAlgorithm(i: number) {
    this.model.targets[i].algorithms.push(this.modelService.createTargetAlgorithm(this.modelService.getDefaultAlgorithmDef()));
  }
  addTarget() {
    console.log("Adding new feature");
    var target = new RPTarget();
    target.algorithms = [];
    target.algorithms.push(this.modelService.createTargetAlgorithm(this.modelService.getDefaultAlgorithmDef()));
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
    this.model.features[i].type = dt;
  }
  changeTargetDataType(dt: string, i: number) {
    this.model.targets[i].type = dt;
  }
  changeAlgorithm(alg: string) {
    console.log(alg);
    this.curr_alg = this.getAlg(alg);
    console.log("Looking for long name " + alg + " and found:");   
    console.log(this.curr_alg);
    this.content = this.curr_alg.parms;
    this.setupStorage(this.content);
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
  getParmString(plist: RPParameter[]) : string {
    var pret = "";
    for (var p of plist)
      pret = pret + p.parm_name + "=" + p.parm_value + "; ";
    return pret;
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
    this.showParm = false; 
  }
  cancelParmDialog() {
    this.showParm = false;
  }
  resetParmDialog() {
  }
  getAlgString(ta: RPTargetAlgorithm) : string {
    return "alg=" + ta.short_name+ "; " + this.getParmString(ta.parms);
  }
  showAlgEditor(i: number, j: number) {
    this.curr_index  = i;
    this.curr_index2 = j;
    console.log("Target=" + i + " Alg=" + j);
    this.alg = this.model.targets[i].algorithms[j];
    console.log("Current algorithm is:")
    console.log(this.alg);
    console.log(this.model.targets[i].algorithms);
    this.showAlg = true;
  }
  saveAlgorithm(alg: RPTargetAlgorithm) {
    console.log("Saving algorithm:");
    console.log("Target=" + this.curr_index + " Alg=" + this.curr_index2);
    console.log(alg);
    this.model.targets[this.curr_index].algorithms[this.curr_index2] = alg;
    console.log(this.model.targets[this.curr_index].algorithms);
    this.showAlg=false;
  }
  cancelAlgorithm() {
    this.showAlg=false;
    //if (!confirm("You will loose any changes if you reply YES")) 
    //  this.showAlg=true;
  }
  saveAlgDialog() {
   this.model.targets[this.curr_index].algorithms[this.curr_index2].parms = this.parm_storage;
   console.log(this.curr_alg);
   this.model.targets[this.curr_index].algorithms[this.curr_index2].short_name = this.curr_alg.short_name;
   this.showAlg  = false;   
  }
  cancelAlgDialog() {
    this.showAlg  = false;   
  }
  resetAlgDialog() {
  }
  trackByIndex(index: number, value: number) {
    return index;
  }
}
