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
  alg          : RPTargetAlgorithm;
  showParm     : boolean = false;
  showAlg      : boolean = false;
  parmDefs     : RPParameterDef[];
  parms        : RPParameter[];
  f_or_t       : string;
  curr_index   : number;
  curr_index2  : number;
  curr_type    : string;

  constructor(private modelService : ModelService, private router: Router /* , private modalService: ModalService*/) { 
  }

  ngOnInit() {
    this.modelService.getModelClasses().subscribe(resultArray => {
        this.modelClasses = resultArray as RPModelClass[];
    });
    this.dataTypes = this.modelService.getDataTypes();
    this.algDefs = this.modelService.getAlgorithmDefs();
    this.model = new RPModel();
    this.model.version = 1;
    this.model.features = [];
    this.model.targets = [];
    this.model.notes = [];
    this.addFeature();
    this.addTarget();
    this.alg = this.model.targets[0].algorithms[0];
    this.parmDefs = this.dataTypes[0].parms;
    this.parms = this.createParms(this.parmDefs);
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
  createParms(plist: RPParameterDef[]) {
    var ps = [];
    for (var p of plist) {
      var pp = new RPParameter(p.parm_name, p.parm_default, p.data_type);
      ps.push(pp);
    }    
    return ps;
  }
  addFeature() {
    var feature = new RPFeature();
    feature.parms = [];
    feature.type = this.dataTypes[0].datatype_name;
    this.model.features.push(feature);
  }
  deleteFeature(i : number) {
    this.model.features.splice(i, 1);
  }
  addAlgorithm(i: number) {
    this.model.targets[i].algorithms.push(this.modelService.createTargetAlgorithm(this.modelService.getDefaultAlgorithmDef()));
  }
  deleteAlgorithm(i: number, j: number) {
    this.model.targets[i].algorithms.splice(j, 1);
  }
  addTarget() {
    var target = new RPTarget();
    target.algorithms = [];
    target.algorithms.push(this.modelService.createTargetAlgorithm(this.modelService.getDefaultAlgorithmDef()));
    target.parms = [];
    target.type = this.dataTypes[0].datatype_name;
    this.model.targets.push(target);
  }
  deleteTarget(i : number) {
    this.model.targets.splice(i, 1);
  }
  changeFeatureDataType(dt: string, i: number) {
    this.model.features[i].type = dt;
    this.model.features[i].parms = [];
  }
  changeTargetDataType(dt: string, i: number) {
    this.model.targets[i].type = dt;
    this.model.targets[i].parms = [];
  }
  showParmEditor(dt : string, f_or_t: string, i: number) {
    this.parmDefs = this.getParms(dt).parms;
    if (f_or_t == 'feature' && this.model.features[i].parms.length > 0) {
        this.parms = this.model.features[i].parms;
    }
    else if (f_or_t == 'target' && this.model.targets[i].parms.length > 0) {
      this.parms = this.model.targets[i].parms;
    }
    else {
      this.parms = this.createParms(this.parmDefs);
    }
    this.curr_type = f_or_t;
    this.curr_index = i;
    this.showParm = true;
  }
  getParmString(plist: RPParameter[]) : string {
    var pret = "";
    for (var p of plist)
      pret = pret + p.parm_name + "=" + p.parm_value + "\n";
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
  saveParms(plist : RPParameter[]) {
    if (this.curr_type == 'feature') this.model.features[this.curr_index].parms = plist;
    else if (this.curr_type == 'target') this.model.targets[this.curr_index].parms = plist;
    this.showParm = false; 
  }
  cancelParms() {
    this.showParm = false;
  }
  getAlgString(ta: RPTargetAlgorithm) : string {
    return "alg=" + ta.short_name+ "\n" + this.getParmString(ta.parms);
  }
  showAlgEditor(i: number, j: number) {
    this.curr_index  = i;
    this.curr_index2 = j;
    this.alg = this.model.targets[i].algorithms[j];
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
  trackByIndex(index: number, value: number) {
    return index;
  }
}
