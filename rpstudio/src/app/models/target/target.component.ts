import { Component, OnInit, Input } from '@angular/core';
import { RPDataType, RPParameter, RPFeature, RPTargetAlgorithm, RPTarget, RPModel, RPAlgorithmDef} from '../../shared/db-classes';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.css']
})
export class TargetComponent implements OnInit {

  @Input() target : RPTarget;

  constructor() { }

  ngOnInit() {
  }

  showParms() {

  }

  showAlgorithms() {
  	
  }

}
