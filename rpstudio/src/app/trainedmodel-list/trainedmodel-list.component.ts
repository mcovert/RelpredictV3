import { Component, OnInit, Input } from '@angular/core';
import { RPTrainedModel } from '../shared/db-classes';

@Component({
  selector: 'app-trainedmodel-list',
  templateUrl: './trainedmodel-list.component.html',
  styleUrls: ['./trainedmodel-list.component.css']
})
export class TrainedmodelListComponent implements OnInit {

  @Input() trained_models : RPTrainedModel[];
  
  constructor() { }

  ngOnInit() {
  }
  showTrainedModel() {
  	window.open("../assets/Decision%20Tree%20Viewer/main.html", '_blank'); 	  	
  }
}
