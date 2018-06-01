import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';
import { ModelService } from '../../services/model.service';
import { RPJobTemplate, RPJobTemplateParm, ReturnObject, RPJobSubmitInfo, RPModel} from '../../shared/db-classes';
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
showMD = false;
model: RPModel;
modelName: string;

 constructor(private jobservice : JobService, private modelservice: ModelService, private globalService: GlobalService, 
             private authService: AuthService, private router: Router) {}

  ngOnInit() {
    console.log("Submitter");
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
  setParm(i: number, v: string) {
    console.log(i, v);
    this.jobs[this.currentJob].parms[i].parm_value = v;
  }
  submitJob() {
  	 var currJob = this.jobs[this.currentJob];
  	 var cmd = currJob.cmd;
     //for (var i = 0; i < currJob.parms.length; i++) {
     // if (currJob.parms[i].parm == 'sql') {
     //  currJob.parms[i].parm_value = "\"" + this.globalService.stripQuotes(currJob.parms[i].parm_value) + "\""; 
     //}
     //	cmd = cmd + ' --' + currJob.parms[i].parm +
     //	            ' ' + currJob.parms[i].parm_value;
     //}
     var jobInfo = { username: this.authService.getUsername(), 
                     jobclass: currJob.job_class, 
                     jobname:  currJob.job_name, 
                     parms:    currJob.parms };
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
  selectModel(model: string, i: number) {
    console.log("Model selected is " + model + " at position " + i);
    var currJob = this.jobs[this.currentJob];
    currJob.parms[i].parm_value = model;
    this.modelName = model;

  }
  showModelDialog()
  {
    this.modelservice.getModelByName(this.modelName).subscribe(result => {
      this.model = result.model as RPModel;
      this.showMD = true;
      console.log(this.model);
    });
  }
  closeModelDialog() {
    this.showMD = false;
  }
}
