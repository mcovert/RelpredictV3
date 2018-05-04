import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { JobService } from '../../services/job.service';
import { RPJobTemplate, RPJobTemplateParm, ReturnObject} from '../../shared/db-classes';
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

  }
}
