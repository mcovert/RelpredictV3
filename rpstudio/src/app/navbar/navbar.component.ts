import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService : AuthService) { }

  ngOnInit() {
  }

  getUsernameAndRole() {
    return this.authService.getUsernameAndRole();
  }
  showBrand() {
  	window.open("http://www.AnalyticsInside.us", "_blank");
  }
}