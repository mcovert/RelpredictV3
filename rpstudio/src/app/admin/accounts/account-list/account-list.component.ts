import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
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
