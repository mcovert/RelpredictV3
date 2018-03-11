import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  authservice : AuthService = null;
  constructor(authService : AuthService) {
    this.authservice = authService;
  }

  ngOnInit() {
  }

}
