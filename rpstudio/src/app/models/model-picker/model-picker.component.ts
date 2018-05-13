import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { GlobalService } from '../../services/global.service';
import { RPModel, RPFeature, RPTarget, RPModelClass, RPModelTemplate, RPDataType, RPFieldTemplate } from '../../shared/db-classes';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-model-picker',
  templateUrl: './model-picker.component.html',
  styleUrls: ['./model-picker.component.css']
})
export class ModelPickerComponent implements OnInit {
  @Output() selectedModel : EventEmitter<string> = new EventEmitter<string>();
  models : RPModel[];
  modelNum = 0;
  constructor(private modelService : ModelService, private globalservice: GlobalService) { 

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
        this.selectModel(0);
     });
  }

  ngOnInit() {
  }
  makeModelName(model: RPModel) {
  	return model.model_class + "/" + model.name + "/" + model.version;
  }
  selectModel(i: number) {
  	var mname = this.makeModelName(this.models[i]);
  	console.log(i + "=" + mname);
  	this.selectedModel.emit(mname);
  }

}
