import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { RPDataType, RPParameter, RPBatch, RPDatafile, RPFieldmap, RPDatamap} from '../shared/db-classes';
import { GlobalService } from './global.service';

@Injectable()
export class DataService {

httpService    : HttpClient;
batches        : Observable<RPBatch[]>;
datafiles      : Observable<RPDatafile[]>;
datamaps       : Observable<RPDatamap[]>;

datamapTypes   : string[] = [ "Map", "Xlate" ];

  constructor(private http: HttpClient, private globalService: GlobalService) { 
      this.httpService = http;
      console.log("Data service created...");
  }

  getBatches()  : Observable<RPBatch[]> { 
      this.batches = this.httpService.get('http://ai25:3000/api/batches') as Observable<RPBatch[]>;
      return this.batches;
  }
  getDatafiles()  : Observable<RPDatafile[]> { 
      this.datafiles = this.httpService.get('http://ai25:3000/api/datafiles') as Observable<RPDatafile[]>;
      return this.datafiles;
  }
  getDatamapTypes() {
    return this.datamapTypes;
  }
  getDatamaps()  : Observable<RPDatamap[]> { 
      this.datamaps = this.httpService.get('http://ai25:3000/api/datamaps') as Observable<RPDatamap[]>;
      return this.datamaps;
  }
  createDatamap(datamap: RPDatamap) {}
  updateDatamap(datamap: RPDatamap) {}
  deleteDatamap(id: string) {}
}
