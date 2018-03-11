import { Component, OnInit, Injectable } from '@angular/core';
import { DataService } from '../services/data.service';
import { RPDatafile, RPBatch, RPDataType, RPDatamap, RPFieldmap} from '../shared/db-classes';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  batches     : RPBatch[];
  datafiles   : RPDatafile[];
  datamaps    : RPDatamap[];
  oBatch : Observable<RPBatch[]>;
  oDF    : Observable<RPDatafile[]>;
  oDM    : Observable<RPDatamap[]>;

  constructor(private dataservice : DataService, private router: Router) {
     this.oBatch = dataservice.getBatches();
     this.oDF    = dataservice.getDatafiles();
     this.oDM    = dataservice.getDatamaps();
  }

  ngOnInit() {
     this.oBatch.subscribe(resultArray => {
        this.batches = resultArray;
        console.log('Batches:');
        console.log(this.batches);
     });
     this.oDF.subscribe(resultArray => {
        this.datafiles = resultArray;
        console.log('Datafiles:');
        console.log(this.datafiles);
     });
     this.oDM.subscribe(resultArray => {
        this.datamaps = resultArray;
        console.log('Datamaps:');
        console.log(this.datamaps);
     });
  }
}