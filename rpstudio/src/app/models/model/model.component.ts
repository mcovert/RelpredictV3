import { Component, OnInit, Input } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { RPDataType, RPParameter, RPFeature, RPTargetAlgorithm, RPTarget, RPModel, RPAlgorithmDef, RPTrainedModel} from '../../shared/db-classes';
import { ActivatedRoute} from "@angular/router";
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent implements OnInit {

  model : RPModel;
  trained_models : RPTrainedModel[];
  id    : string;
  modelForm: FormGroup;

  constructor(private modelService : ModelService, private route: ActivatedRoute) { 
     this.route.params.subscribe( params => { 
      	this.id = params['id']; 
     	  console.log('ID=' + this.id); 
     });
  }

  ngOnInit() {
  	this.modelService.getModelById(this.id).subscribe(result => {
  		  this.model = result as RPModel; 
  		  console.log(this.model); 
        //this.trained_models = this.modelService.getTrainedModels(this.model.model_class, this.model.model_name, this.model.model_version); 
        //console.log(this.trained_models);
  	});
  }
}
