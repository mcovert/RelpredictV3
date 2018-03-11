import { Component, OnInit, Injectable } from '@angular/core';
import { JobService } from '../services/job.service';
import { RPJob, RPJobExec} from '../shared/db-classes';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  jobs        : RPJob[];
  jobexecs  = [
        { job_id: "rp_train_20180201093412",
          started : "2018-02-01:09:34:16",
          ended   : "2018-02-01:09:46:32",
          status  : "SUCCESS"
        },
        { job_id: "rp_train_20180202091011",
          started : "2018-02-02:09:10:11",
          ended   : "2018-02-02:09:31:12",
          status  : "SUCCESS"
        },
        { job_id: "rp_predict_20180202100002",
          started : "2018-02-02:10:00:08",
          ended   : "2018-02-02:10:02:12",
          status  : "SUCCESS"
        }
     ];
  oJob        : Observable<RPJob[]>;
  oJobExec    : Observable<RPJobExec[]>;

  constructor(private jobservice : JobService, private router: Router) {
     this.oJob     = jobservice.getJobs();
     //this.oJobExec = jobservice.getJobExecs();
  }

  ngOnInit() {
     this.oJob.subscribe(resultArray => {
        this.jobs = resultArray as RPJob[];
        console.log('Jobs:');
        console.log(this.jobs);
     });
     //this.oJobExec.subscribe(resultArray => {
     //   this.jobexecs = resultArray as JobExec[];
     //   console.log('Jobexecs:');
     //   console.log(this.jobexecs);
     //});
  }
}