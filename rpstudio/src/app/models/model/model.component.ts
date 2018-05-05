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

  model : RPModel = new RPModel();
  trained_models : RPTrainedModel[];
  id    : string = '5a91e6530b25f0948b439c9e';
  modelForm: FormGroup;

  constructor(private modelService : ModelService, private route: ActivatedRoute) { 
     this.route.params.subscribe( params => { 
      	//this.id = params['id']; 
        console.log("Finding model " + this.id);
        this.modelService.getModelById(this.id).subscribe(result => {
            this.model = result as RPModel; 
            console.log(this.model);
        });
     });
  }

  ngOnInit() {
  }
}
