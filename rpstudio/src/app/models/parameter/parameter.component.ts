import { Component, OnInit, Input } from '@angular/core';
import { RPParameter} from '../../shared/db-classes';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.css']
})
export class ParameterComponent implements OnInit {

  @Input() parameter : RPParameter;

  constructor() { }

  ngOnInit() {
  }

}
