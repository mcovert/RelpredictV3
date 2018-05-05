import { Component, OnInit, Injectable } from '@angular/core';
import { ModelService } from '../services/model.service';
import { RPDataType, RPParameter, RPFeature, RPTargetAlgorithm, RPTarget, RPModel, RPAlgorithmDef, RPModelClass} from '../shared/db-classes';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

class ModelWrapper {
  models: RPModel[];
}

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.css']
})
export class ModelsComponent implements OnInit {

  modelService  : ModelService;
  datatypes     : RPDataType[];
  algorithms    : RPAlgorithmDef[];
  models        : RPModel[];
  modelclasses  : RPModelClass[];
  model_classes : string[] = [];
  menuState     : string = 'out';
  currentPos    : number = 0;
  currentClass  : string = "All Models";

  constructor(modelservice : ModelService, private router: Router) {
     this.modelService = modelservice;
  }

  ngOnInit() {
     this.datatypes = this.modelService.getDataTypes();

     this.algorithms = this.modelService.getAlgorithmDefs();
     
     this.modelService.getModelClasses().subscribe(resultArray => {
        this.modelclasses = resultArray as RPModelClass[];
        if (this.model_classes.indexOf('Current Models') == -1) 
          this.model_classes.unshift("Current Models");
        if (this.model_classes.indexOf('All Models') == -1) 
          this.model_classes.unshift("All Models");
        for (var mc of this.modelclasses) {
             this.model_classes.push(mc.label);
        }
     });

     this.modelService.getModels().subscribe(resultArray => {
        console.log(resultArray);
        this.models = resultArray.models;
        this.models.sort((m1 : RPModel, m2 : RPModel) : number => {
            let m1x = m1.model_class + '.' + m1.name + '.' + m1.version;
            let m2x = m2.model_class + '.' + m2.name + '.' + m2.version;

            if (m1x < m2x) return -1;
            else if (m1x > m2x) return 1;
            else return 0;
        });
     });

  }
  toggleMenu() {
    // 1-line if statement that toggles the value:
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  } 
  setCurrentClass(currClass : string, pos : number) {
    this.currentPos = pos;
    if (pos > 1)
      this.currentClass = this.modelclasses[pos - 2].class_name;
    else
      this.currentClass = currClass;
    //if (this.currentClass == "All")
    //  this.models.filter(m2 => m2);
    //else
    //  this.models.filter(m2 => m2.model_class === this.currentClass);
  }
  navigate(id : string) {
     this.router.navigate(['models', id]);
  }
  newModelName(i : number) : boolean {
    if (i == 0) return true;
    else return !(this.models[i].model_class === this.models[i - 1].model_class &&
                this.models[i].name === this.models[i - 1].name);
  }
  newModelDescription(i : number) : boolean {
    if (i == 0) return true;
    else if (this.newModelName(i)) return true; 
    else return this.models[i].description != this.models[i - 1].description;
  }
  setCurrent(i: number) {
    this.models[i].current = true;
  }
}
