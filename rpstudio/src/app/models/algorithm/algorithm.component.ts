import { Component, OnInit, Input } from '@angular/core';
import { RPDataType, RPParameter, RPFeature, RPTargetAlgorithm, RPTarget, RPModel, RPAlgorithmDef} from '../../shared/db-classes';

@Component({
  selector: 'app-algorithm',
  templateUrl: './algorithm.component.html',
  styleUrls: ['./algorithm.component.css']
})
export class AlgorithmComponent implements OnInit {

  @Input() algorithm : RPTargetAlgorithm;

  constructor() { }

  ngOnInit() {
  }

}
