import { Component, OnInit, Injectable } from '@angular/core';
import { DataService } from '../services/data.service';
import { RPDatafile, RPBatch, RPDataType, RPDatamap, RPFieldmap, RPModelTemplate, RPFieldTemplate} from '../shared/db-classes';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  batches           : RPBatch[];
  datafiles         : RPDatafile[];
  datamaps          : RPDatamap[];
  oBatch            : Observable<RPBatch[]>;
  oDF               : Observable<RPDatafile[]>;
  oDM               : Observable<RPDatamap[]>;
  filteredDatafiles : RPDatafile[];

  showMEDialog      : boolean = false;

  showDMDialog      : boolean = false;
  datamap           : RPDatamap = new RPDatamap();
  mode              : string;
  modelTemplate     : RPModelTemplate = new RPModelTemplate();

  constructor(private dataservice : DataService, private router: Router) {
     this.oBatch = dataservice.getBatches();
     this.oDF    = dataservice.getDatafiles();
     this.oDM    = dataservice.getDatamaps();
  }

  ngOnInit() {
     this.oBatch.subscribe(resultArray => {
        this.batches = resultArray;
     });
     this.oDF.subscribe(resultArray => {
        this.datafiles = resultArray;
        this.filteredDatafiles = this.datafiles;
     });
     this.oDM.subscribe(resultArray => {
        this.datamaps = resultArray;
     });
  }
  createModel(i: number) {
    console.log(this.datamaps[i]);
    this.modelTemplate = new RPModelTemplate();
    this.modelTemplate.model_name = this.datamaps[i].datamap_name;
    this.modelTemplate.model_version = 1;
    for (var fm of this.datamaps[i].fields) {
      let f = new RPFieldTemplate();
      f.field_name = fm.field_name;
      f.field_type = fm.field_type;
      f.field_label = fm.field_name;
      this.modelTemplate.fields.push(f);
    }
    console.log(this.modelTemplate);
    this.showMEDialog = true;
  }
  saveModel() {
    this.showMEDialog = false;
  }
  cancelModel() {
    this.showMEDialog = false;
  }

  showDatafilesForBatch(batch_id: string) {
    this.filteredDatafiles = this.datafiles.filter(df => df.batch_id === batch_id);
  }
  showAllDatafiles() {
    this.filteredDatafiles = this.datafiles;
  }
  releaseBatch(id: string) {}
  holdBatch(id: string) {}
  deleteBatch(id: string) {}

  deleteDatamap(i : number) {
     console.log('delete data map ' + this.datamaps[i].datamap_name)
     //this.showDMDialog = true;
  }
  displayDatamap(i : number) {
     this.mode = 'display';
     this.datamap = this.datamaps[i];
     this.showDMDialog = true;
  }
  createDatamap() {
     this.datamap = new RPDatamap();
     this.mode = 'file';
     this.showDMDialog = true;
  }
  editDatamap(i : number) {
     this.datamap = this.datamaps[i];
     this.mode = 'edit';
     this.showDMDialog = true;
  }
  saveDM() {
    this.showDMDialog = false;
  }
  cancelDM() {
    this.showDMDialog = false;
  }
}