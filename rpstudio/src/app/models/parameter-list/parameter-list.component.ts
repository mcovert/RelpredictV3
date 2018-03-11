import { Component, OnInit, Input } from '@angular/core';
import { RPParameter} from '../../shared/db-classes';

@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.css']
})
export class ParameterListComponent implements OnInit {

  @Input() parameters : RPParameter[];

  constructor() { }

  ngOnInit() {
  }

}
