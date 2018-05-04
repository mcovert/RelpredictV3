import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { JobService } from '../../services/job.service';
import { RPJobTemplate, RPJobTemplateParm, ReturnObject, RPJobSubmitInfo} from '../../shared/db-classes';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

@Component({
  selector: 'app-job-submitter',
  templateUrl: './job-submitter.component.html',
  styleUrls: ['./job-submitter.component.css']
})
export class JobSubmitterComponent implements OnInit {

jobs : RPJobTemplate[] = [];
currentJob = -1;
jobServer = "";
jobLink = "";

 constructor(private jobservice : JobService, private router: Router) {}

  ngOnInit() {
  	this.jobservice.getJobTemplate().subscribe(result => {
  		console.log(result);
  		this.jobs = JSON.parse(result.returned_object).jobs;
  		this.currentJob = 0;
  		console.log(this.jobs);
  	})
  }
  setCurrentJob(i: number) {
  	this.currentJob = i;
  }
  submitJob() {
  	 var currJob = this.jobs[this.currentJob];
  	 var cmd = currJob.cmd;
     for (var i = 0; i < currJob.parms.length; i++) {
     	cmd = cmd + ' --' + currJob.parms[i].parm +
     	            ' ' + currJob.parms[i].parm_value;
     }
     var jobInfo = { username: 'mcovert', command: cmd, jobtype: currJob.job_type };
     console.log(jobInfo);
     this.jobservice.submitJob(jobInfo).subscribe(result => {
     	console.log(result);
     	var ret = JSON.parse(result.returned_object);
     	this.jobServer = ret.server; 
     	this.jobLink = ret.monitor; 
     });
  }
  cancelJob() {
  }
  openMonitor() {
  	window.open(this.jobLink, '_blank');
  }
}
