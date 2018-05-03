import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-datatype-selector',
  templateUrl: './datatype-selector.component.html',
  styleUrls: ['./datatype-selector.component.css']
})
export class DatatypeSelectorComponent implements OnInit {

  @Input() identifier : string;
  @Input() initialType: string;
  @Output() selectedType   : EventEmitter<string> = new EventEmitter<string>();

  dataTypes = [ "integer", "date", "datetime", "double", "boolean", "string", "text"];

  currentIndex = 0;
  currentType = "integer";
  selectId: string;


  constructor() { }

  ngOnInit() {
   	 this.selectId = this.identifier;
     this.currentIndex = this.dataTypes.indexOf(this.initialType);
     this.currentType = this.initialType;  	
  }
  changeDataType(type : string) {
     this.currentIndex = this.dataTypes.indexOf(type);
     this.currentType = type;
     this.selectedType.emit(this.identifier + "=" + this.currentType);
  }

}
