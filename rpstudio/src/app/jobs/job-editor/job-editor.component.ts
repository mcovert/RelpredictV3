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

  @Input() job : RPJob;

  constructor(private jobservice : JobService, private router: Router) {}

  ngOnInit() {
  }

}
