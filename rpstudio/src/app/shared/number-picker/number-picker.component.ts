import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.css']
})
export class NumberPickerComponent implements OnInit {

  @Input() minimum   : number;
  @Input() maximum   : number;
  @Input() increment : number;
  @Input() startAt   : number;
  @Output() number   : EventEmitter<number> = new EventEmitter<number>();

  num: number;	

  constructor() { }

  ngOnInit() {
  	this.num = this.startAt;
  }
  plus() {
  	if (this.num < this.maximum) {
  	   this.num += this.increment;
  	   this.fire();
    }
  }
  minus() {
  	if (this.num > this.minimum) {
  	   this.num -= this.increment;
  	   this.fire();
  	}
  }
  fire() {
  	this.number.emit(this.num);
  }

}
