import { Component, OnInit, Input } from '@angular/core';
import { RPDataType, RPParameter, RPFeature, RPTargetAlgorithm, RPTarget, RPModel, RPAlgorithmDef} from '../../shared/db-classes';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent implements OnInit {

  @Input() feature : RPFeature;

  constructor() { }

  ngOnInit() {
  }

  showParms() {

  }

}
