import { Component, OnInit, Injectable } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { RPLogEntry } from '../shared/db-classes';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

@Component({
  selector: 'app-log-browser',
  templateUrl: './log-browser.component.html',
  styleUrls: ['./log-browser.component.css']
})
export class LogBrowserComponent implements OnInit {

  logentries : RPLogEntry[];
  adminservice : AdminService;
  authservice :  AuthService;

  constructor(adminService : AdminService, authService : AuthService, private router: Router) {
  	this.adminservice = adminService;
  	this.authservice = authService;
  }

  ngOnInit() {
     this.adminservice.getLog().subscribe(resultArray => {
        this.logentries = resultArray as RPLogEntry[];
     });
  }

}
