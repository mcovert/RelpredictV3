import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { RPDataType, RPParameter, RPBatch, RPDatafile, RPFieldmap, RPDatamap,
         ReturnObject } from '../shared/db-classes';
import { GlobalService } from './global.service';
import { AuthService } from './auth.service';

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

  constructor(private http: HttpClient, private globalService: GlobalService, private authService: AuthService) { 
      this.httpService = http;
      console.log("Data service created...");
  }

  // getDatafiles()  : Observable<RPDatafile[]> { 
  //     this.datafiles = this.httpService.get('http://ai25:3000/api/datafiles', this.authService.getHttpHeader()) as Observable<RPDatafile[]>;
  //     return this.datafiles;
  // }
  getDatafileInfo(fileName) : Observable<FIRetObj> { 
      return this.httpService.post(this.authService.addAccessTokenToURL('http://ai25:3000/api/datafiles/getfileinfo'), {filename: fileName}) as Observable<FIRetObj>;
  }
  getDatafileHeader(fileName) : Observable<FHRetObj> { 
      return this.httpService.post(this.authService.addAccessTokenToURL('http://ai25:3000/api/datafiles/getfileheader'), {filename: fileName}) as Observable<FHRetObj>;
  }
  getDatamapTypes() {
    return this.datamapTypes;
  }
  getDatamaps()  : Observable<RPDatamap[]> { 
      this.datamaps = this.httpService.get(this.authService.addAccessTokenToURL('http://ai25:3000/api/datafiles/datamaps')) as Observable<RPDatamap[]>;
      return this.datamaps;
  }
  getDatamap(datamap : string)  : Observable<ReturnObject> { 
      return this.httpService.post(this.authService.addAccessTokenToURL('http://ai25:3000/api/datafiles/getdatamap'), { datamap_name: datamap}) as Observable<ReturnObject>;
  }

  getDataDirectory() : Observable<RetObj> {
     this.nodes = this.httpService.get(this.authService.addAccessTokenToURL('http://ai25:3000/api/datafiles/listdatafiles')) as Observable<RetObj>;
     return this.nodes;
  }
  createDatamap(datamap: RPDatamap, dir: string, overwrite: boolean) : Observable<ReturnObject> {
     return this.httpService.post(this.authService.addAccessTokenToURL('http://ai25:3000/api/datafiles/createdatamap'), 
       {datamap: datamap, dir: dir, overwrite: overwrite}) as Observable<ReturnObject>;    
  }
  updateDatamap(datamap: RPDatamap) {}
  deleteFile(file: string) {
     return this.httpService.post(this.authService.addAccessTokenToURL('http://ai25:3000/api/datafiles/deletefile'), 
       {filename: file}) as Observable<ReturnObject>;        
  }

  uploadFiles(files : Array<File>) {
    let formData: any = new FormData();

    for(let i =0; i < files.length; i++){
        formData.append("file[]", files[i], files[i]['name']);
    }
    return this.httpService.post(this.authService.addAccessTokenToURL('http://ai25:3000/api/datafiles/uploadfiles'), formData);
  }
}
