import { Component, OnInit, Injectable } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { GlobalService } from '../../services/global.service';
import { Observable } from "rxjs/Observable";
import { Router, ActivatedRoute } from "@angular/router";
import { RPDataType, RPParameter, RPParameterDef, RPFeature, RPTargetAlgorithm, RPTarget, RPModel, RPAlgorithmDef, RPCurrentModel, RPLogEntry, RPTrainedModel,
         RPModelClass, ReturnObject, FieldModelUsage } from '../../shared/db-classes';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-model-create',
  templateUrl: './model-create.component.html',
  styleUrls: ['./model-create.component.css']
})
export class ModelCreateComponent implements OnInit {
  ready        : boolean = false;
  model        : RPModel = new RPModel();
  modelClasses : RPModelClass[];
  dataTypes    : RPDataType[];
  algDefs      : RPAlgorithmDef[];
  alg          : RPTargetAlgorithm;
  showMCDialog : boolean = false;
  model_class_name : string;
  model_class_desc : string;
  showParm     : boolean = false;
  showAlg      : boolean = false;
  showDMDialog : boolean = false;
  parmDefs     : RPParameterDef[];
  parms        : RPParameter[];
  f_or_t       : string;
  curr_index   : number;
  curr_index2  : number;
  curr_type    : string;
  script       : string = '';
  checked      : boolean[] = [];
  mode         : string = "new";  /* new, file, datamap */
  field_source : string = "";
  field_string : string = "";
  fields       : FieldModelUsage[] = [];
  message      : string = "";

  constructor(private modelService : ModelService, private router: Router, 
              private route: ActivatedRoute, private globalservice: GlobalService) { 
     this.route.params.subscribe( params => { 
        this.mode = params['mode'] || "new"; 
        this.field_source = params['field_source'] || "";
        this.field_string = params['fields'] || "";
        if (this.mode == 'datamap' || this.mode == 'file') {
          this.fields = JSON.parse(this.globalservice.decode(this.field_string)); 
          for (var i = 0; i < this.fields.length; i++) this.fields[i].field_use = 'Feature';       
          this.ready = true;
        }
        else
          this.ready = true;
     });
  }

  ngOnInit() {
    this.modelService.getModelClasses().subscribe(resultArray => {
        this.modelClasses = resultArray as RPModelClass[];
        this.model = new RPModel();
        this.model.model_class = this.modelClasses[0].label;
        this.model.version = 1;
        this.model.features = [];
        this.model.targets = [];
        this.model.notes = [];
        this.model.description = "";
        this.model.identifier = "";
        this.model.current = false;
        if (this.mode == 'datamap' || this.mode == 'file') {
          this.model.name = this.field_source + "_model";
          this.model.description = "Model built from " + this.mode + " " + this.field_source;
        }
    });
    this.dataTypes = this.modelService.getDataTypes();
    this.algDefs = this.modelService.getAlgorithmDefs();
    this.parmDefs = this.dataTypes[0].parms;
    this.parms = this.createParms(this.parmDefs);
  }
  setModelClass(mc: string) {
    this.model.model_class = mc;
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
    feature.label = "";
    this.model.features.push(feature);
    this.checked.push(false);
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
    target.description = "";
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
  showDatamapEditor() {
    this.showDMDialog = true;
  }
  saveDM(event) {
    this.showDMDialog = false;    
  }
  cancelDM(event) {
    this.showDMDialog = false;    
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
    this.modelService.createModel(this.model, false).subscribe(
      data => {
         this.router.navigate(['models']);
      },
      error => {
        this.message = "Error saving Model: " + error;
      });
  }
  cancelModel() {
    if (confirm("Are you sure you want to discard this model?")) {
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
    this.model.targets[this.curr_index].algorithms[this.curr_index2] = alg;
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
  showModelClassDialog() {
    this.model_class_name = "";
    this.model_class_desc = "";
    this.showMCDialog = true;
  }
  saveMC() {
    console.log("Adding: " + this.model_class_name + "/" + this.model_class_desc);
    this.showMCDialog = false;
  }
  cancelMC() {
    this.showMCDialog = false;
  }
  fixit(s : string) {
    var r = s.substring(1, s.length - 2);
    var t = "";
    var foundslash = false;
    for (var i = 0; i < r.length; i++) {
       if (r.charAt(i) == '\\') foundslash = true;
       else {
         if (foundslash && r.charAt(i) == "n") {
           t = t + "\n";
         }
         else {
           t = t + r.charAt(i);
         }
         foundslash = false;
       }
    }
    return t;
  }
  getScript() {
    this.model.identifier = "";
    var first = true;
    console.log(this.checked);
    for (var i = 0; i < this.model.features.length; i++) {
      if (this.checked[i]) {
        if (first) this.model.identifier = this.model.identifier + 
           this.model.features[i].name;
        else this.model.identifier = this.model.identifier + "," +
           this.model.features[i].name; 
        first = false;
      }
      console.log(this.model);
    }
    this.modelService.getScript(this.model).subscribe(result => {
      console.log(result);
      let ret = result.returned_object;
      this.script = this.fixit(JSON.stringify(ret));
      console.log(this.script);
    })
  }
  setId(i: number) {
    this.checked[i] = !this.checked[i];
  }
  setUsage(usage: string, index: number) {
    console.log("Setting " + this.fields[index].field_name + " to usage " + usage);
    this.fields[index].field_use = usage;
  }
  fillModelFromFields() {
    for (var i = 0; i < this.fields.length; i++) {
      console.log(this.fields[i]);
      if (this.fields[i].field_use == 'Feature' || this.fields[i].field_use == 'Identifier') {
           var feature = new RPFeature();
           feature.parms = [];
           feature.name = this.fields[i].field_name;
           feature.type = this.fields[i].field_type;
           feature.label = this.fields[i].field_name;;
           this.model.features.push(feature);
           if (this.fields[i].field_use == 'Identifier') {
               this.checked.push(true);
           }
           else {
               this.checked.push(false);
           }
      }
      else if (this.fields[i].field_use == 'Target') {
           var target = new RPTarget();
           target.name = this.fields[i].field_name;
           target.algorithms = [];
           target.algorithms.push(this.modelService.createTargetAlgorithm(this.modelService.getDefaultAlgorithmDef()));
           target.parms = [];
           target.type = this.fields[i].field_type;
           target.description = this.fields[i].field_name;
           this.model.targets.push(target);
      }
    }
    console.log(this.model);
  }
}
