import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RPJob, RPJobExec} from '../shared/db-classes';
import { Observable } from "rxjs/Observable";

@Injectable()
export class JobService {

 httpService    : HttpClient;
 jobs           : Observable<RPJob[]>;
 jobexecs       : Observable<RPJobExec[]>;

 constructor(private http: HttpClient) { 
      this.httpService = http;
      console.log("Job service created...");
  }

  getJobs()  : Observable<RPJob[]> { 
  	  this.jobs = this.httpService.get('http://ai25:3000/api/jobs') as Observable<RPJob[]>;
      return this.jobs;
  }
  getJobExecs()  : Observable<RPJobExec[]> { 
      this.jobexecs = this.httpService.get('http://ai25:3000/api/jobexecs') as Observable<RPJobExec[]>;
      return this.jobexecs;
  }
}
