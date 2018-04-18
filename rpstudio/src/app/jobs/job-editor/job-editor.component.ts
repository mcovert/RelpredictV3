import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { JobService } from '../../services/job.service';
import { RPJob, RPJobExec} from '../../shared/db-classes';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

@Component({
  selector: 'app-job-editor',
  templateUrl: './job-editor.component.html',
  styleUrls: ['./job-editor.component.css']
})
export class JobEditorComponent implements OnInit {

  jobs: RPJob[] = [];
  jobIndex: number = -1;

  constructor(private jobservice : JobService, private router: Router) {}

  ngOnInit() {
  	this.jobservice.getJobs().subscribe(result => {
  		this.jobs = result as RPJob[];
  		this.setIndex(0);
  	})
  }
  setIndex(i: number) {
  	this.jobIndex = i;
  }
  submitJob(job: RPJob) {
  	console.log("job submitted");
  }
}
