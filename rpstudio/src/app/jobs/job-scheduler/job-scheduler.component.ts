import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { JobService } from '../../services/job.service';
import { RPJob, RPJobExec} from '../../shared/db-classes';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

@Component({
  selector: 'app-job-scheduler',
  templateUrl: './job-scheduler.component.html',
  styleUrls: ['./job-scheduler.component.css']
})
export class JobSchedulerComponent implements OnInit {

  job: RPJob;
  days: string;
  times: string;
  every: string;
  type: string;	

  constructor() { }

  ngOnInit() {
  }
  saveSchedule() {}
  cancelSchedule() {}

}
