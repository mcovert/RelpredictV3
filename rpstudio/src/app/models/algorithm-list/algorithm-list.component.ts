import { Component, OnInit, Input } from '@angular/core';
import { RPDataType, RPParameter, RPFeature, RPTargetAlgorithm, RPTarget, RPModel, RPAlgorithmDef} from '../../shared/db-classes';

@Component({
  selector: 'app-algorithm-list',
  templateUrl: './algorithm-list.component.html',
  styleUrls: ['./algorithm-list.component.css']
})
export class AlgorithmListComponent implements OnInit {

  @Input() algorithms : RPTargetAlgorithm[];

  constructor() { }

  ngOnInit() {
  }

}
