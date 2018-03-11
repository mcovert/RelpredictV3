import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  accounts = {};

  adminservice : AdminService = null;
  constructor(adminService : AdminService) {
    this.adminservice = adminService;
    this.accounts = this.adminservice.getAccounts();
  }
  ngOnInit() {
  }

  getAccounts() {
    return this.accounts;
  }

}
