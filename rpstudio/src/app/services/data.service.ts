import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { RPDataType, RPParameter, RPBatch, RPDatafile, RPFieldmap, RPDatamap} from '../shared/db-classes';
import { GlobalService } from './global.service';

class TreeNode {
  path     : string;
  name     : string;
  children : TreeNode[];
  size     : number;
  type     : string;
}
class RetObj {
  filedir: TreeNode;
}
class FileInfo {
  datafile_name    : string;
  datafile_size    : number;
  datafile_created : string;
  datafile_format  : string;
  datafile_dir     : string;
  datafile_type    : string;
  datafile_fullname: string;
}
class FIRetObj {
  datafile_info    : FileInfo; 
}
class FileHeader {
  datafile_name    : string;
  datafile_header  : string;
  datafile_record  : string;
}
class FHRetObj {
  datafile_content : FileHeader;
}

@Injectable()
export class DataService {

httpService    : HttpClient;
batches        : Observable<RPBatch[]>;
datafiles      : Observable<RPDatafile[]>;
datamaps       : Observable<RPDatamap[]>;
nodes          : Observable<RetObj>;

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
  getDatafileInfo(fileName) : Observable<FIRetObj> { 
      return this.httpService.post('http://ai25:3000/api/datafiles/getfileinfo', {filename: fileName}) as Observable<FIRetObj>;
  }
  getDatafileHeader(fileName) : Observable<FHRetObj> { 
      return this.httpService.post('http://ai25:3000/api/datafiles/getfileheader', {filename: fileName}) as Observable<FHRetObj>;
  }
  getDatamapTypes() {
    return this.datamapTypes;
  }
  getDatamaps()  : Observable<RPDatamap[]> { 
      this.datamaps = this.httpService.get('http://ai25:3000/api/datamaps') as Observable<RPDatamap[]>;
      return this.datamaps;
  }
  getDataDirectory() : Observable<RetObj> {
     this.nodes = this.httpService.get('http://ai25:3000/api/datafiles/listdatafiles') as Observable<RetObj>;
     console.log(this.nodes);
     return this.nodes;
  }
  createDatamap(datamap: RPDatamap) {}
  updateDatamap(datamap: RPDatamap) {}
  deleteDatamap(id: string) {}

  uploadFiles(files : Array<File>) {
    let formData: any = new FormData();
    console.log(files);

    for(let i =0; i < files.length; i++){
        formData.append("file[]", files[i], files[i]['name']);
    }
    console.log('form data variable :   '+ formData.toString());

    return this.httpService.post(this.globalService.getServerUrl() + 'datafiles/uploadfiles', formData);
  }

}
