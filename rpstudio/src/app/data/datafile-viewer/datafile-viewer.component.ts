import { Component, OnInit, Injectable } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { DataService } from '../../services/data.service';
import { RPDatafile, RPBatch} from '../../shared/db-classes';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-datafile-viewer',
  templateUrl: './datafile-viewer.component.html',
  styleUrls: ['./datafile-viewer.component.css']
})
export class DatafileViewerComponent implements OnInit {

  datafiles         : RPDatafile[];
  filteredDatafiles : RPDatafile[];

  constructor(private dataservice : DataService, private globalService : GlobalService) {
  }

  ngOnInit() {
     this.dataservice.getDatafiles().subscribe(resultArray => {
        this.datafiles = resultArray;
        this.filteredDatafiles = this.datafiles;
     });
  }
  showDatafilesForBatch(batch_id: string) {
    this.filteredDatafiles = this.datafiles.filter(df => df.batch_id === batch_id);
  }
  showAllDatafiles() {
    this.filteredDatafiles = this.datafiles;
  }
}