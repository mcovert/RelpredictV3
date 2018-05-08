import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FileLoaderComponent } from '../../file-loader/file-loader.component';
import { RPDatamap, RPFieldmap, RPDataType, RPParameterDef } from '../../shared/db-classes';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { DataService } from '../../services/data.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-datamap',
  templateUrl: './create-datamap.component.html',
  styleUrls: ['./create-datamap.component.css']
})
export class CreateDatamapComponent implements OnInit {
   datamap: RPDatamap = new RPDatamap();
   datamapTypes: string[];
   dataTypes = [ "integer", "date", "datetime", "double", "boolean", "string", "text"];


  constructor(private globalService: GlobalService, private dataService: DataService,
              private router: Router ) {  	//this.dataTypes = globalService.getDataTypes();
  	this.datamapTypes = dataService.getDatamapTypes();
  }

  ngOnInit() {
  	this.newField();
  }

  ngOnChanges() {
  }

  save() {
    this.dataService.createDatamap(this.datamap, "", true).subscribe(result => {
  	   this.router.navigate(['data'])
    });
  }

  cancel() {
  	this.router.navigate(['home'])
  }

  reset() {
    this.datamap.fields = [];
    this.newField();
  }
  newField() {
  	var fm = new RPFieldmap();
    fm.field_type = this.dataTypes[0];
    fm.field_name = "field_"+ this.datamap.fields.length;
  	this.datamap.fields.push(new RPFieldmap());
  }
}

