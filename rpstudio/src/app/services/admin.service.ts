import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { RPDataType, RPParameter, RPFeature, RPTargetAlgorithm, RPTarget, RPModel, RPAlgorithmDef, RPCurrentModel, RPLogEntry} from '../shared/db-classes';

@Injectable()
export class AdminService {
  accounts = [
     {  accountname: 'Quadax Inc.',
        shortname:  'QDX',
        description: 'Healthcare Revenue Cycle Management',
        address: 'Middleburg Heights, OH',
        contact: 'Brean Bark (call collect any time day or night)',
        enabled: true
      }
  ];
  constructor(private http: HttpClient) { }

  getAccounts() {
    return this.accounts;
  }

  getLog() {
      return this.http.get('http://ai25:3000/api/logs') as Observable<RPLogEntry[]>;

  }

}
