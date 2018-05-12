import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { JobService } from '../../services/job.service';
import { RPJob, RPJobExec} from '../../shared/db-classes';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

@Component({
  selector: 'app-job-scheduler',
  templateUrl: './job-scheduler.component2.html',
  styleUrls: ['./job-scheduler.component.css']
})
export class JobSchedulerComponent implements OnInit {

  job: RPJob;
  days: string;
  times: string;
  every: string;
  type: string;	
  mode = "D";
  repeat = "None";
  interval = 0;
  intervalMode = "";
  selectedDateMoment = new Date();
  selectedTimeMoment = `${this.selectedDateMoment.getHours()}:${this.selectedDateMoment.getMinutes()} ${(this.selectedDateMoment.getHours() > 11 ? 'am' : 'pm')}`;
  weekdays : boolean[];

  constructor() { }

  ngOnInit() {
  	this.weekdays = new Array(7).fill(false);
  	console.log("Scheduler");
  }
  saveSchedule() {}
  cancelSchedule() {}
  setMode(mode: string) {
  	console.log(mode);
  	this.mode = mode;
  }
  setRepeat(r: string) {
  	console.log(r);
  	this.repeat = r;
  }
  setInterval(n: number) {
  	console.log(n);
  	this.interval = n;
  }
  setIntervalMode(m: string) {
  	console.log(m);
  	this.intervalMode = m;
  }
}
