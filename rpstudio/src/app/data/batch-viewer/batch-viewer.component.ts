import { Component, OnInit, Injectable } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { DataService } from '../../services/data.service';
import { RPDatafile, RPBatch, RPDataType, RPDatamap, RPFieldmap, RPModelTemplate, RPFieldTemplate, RPModelClass} from '../../shared/db-classes';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-batch-viewer',
  templateUrl: './batch-viewer.component.html',
  styleUrls: ['./batch-viewer.component.css']
})
export class BatchViewerComponent implements OnInit {
  batches           : RPBatch[];

  constructor(private dataservice : DataService, private globalService : GlobalService) {
  }

  ngOnInit() {
     this.dataservice.getBatches().subscribe(resultArray => {
        this.batches = resultArray;
     });
  }
  releaseBatch(id: string) {

  }
  holdBatch(id: string) {

  }
  deleteBatch(id: string) {

  }
}
