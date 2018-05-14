import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RPJob, RPJobExec, RPJobTemplate, RPJobTemplateParm, ReturnObject, RPJobSubmitInfo} from '../shared/db-classes';
import { Observable } from "rxjs/Observable";
import { GlobalService } from './global.service';
import {AuthService } from './auth.service';
@Injectable()
export class JobService {

 httpService    : HttpClient;
 jobs           : Observable<RPJob[]>;
 jobexecs       : Observable<RPJobExec[]>;

 constructor(private http: HttpClient, private globalService: GlobalService, private authService: AuthService) { 
      this.httpService = http;
      console.log("Job service created...");
  }

  getJobs()  : Observable<RPJob[]> { 
  	  this.jobs = this.httpService.get('http://ai25:3000/api/jobs',this.authService.getHttpHeader()) as Observable<RPJob[]>;
      return this.jobs;
  }
  getJobExecs()  : Observable<RPJobExec[]> { 
      this.jobexecs = this.httpService.get('http://ai25:3000/api/jobexecs',this.authService.getHttpHeader()) as Observable<RPJobExec[]>;
      return this.jobexecs;
  }
  getJobTemplate()  : Observable<ReturnObject> { 
      return this.httpService.get('http://ai25:3000/api/jobs/getjobtemplate',this.authService.getHttpHeader()) as Observable<ReturnObject>;
  }
  submitJob(jobInfo) {
      return this.httpService.post('http://ai25:3000/api/jobs/submitjob', {job_info: jobInfo},this.authService.getHttpHeader()) as Observable<ReturnObject>;
  }
}
