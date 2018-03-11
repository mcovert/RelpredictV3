import { Component, OnInit, Input } from '@angular/core';
import { RPDataType, RPParameter, RPFeature, RPTargetAlgorithm, RPTarget, RPModel, RPAlgorithmDef} from '../../shared/db-classes';

@Component({
  selector: 'app-target-list',
  templateUrl: './target-list.component.html',
  styleUrls: ['./target-list.component.css']
})
export class TargetListComponent implements OnInit {

  @Input() targets : RPTarget[];

  constructor() { }

  ngOnInit() {
  }

}
