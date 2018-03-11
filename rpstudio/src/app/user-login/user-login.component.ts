import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

export class User {
	username: string;
	password: string;
}
@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  model : User = new User();
  authservice: AuthService;
  constructor(private authService : AuthService) {
    this.authservice = authService;
  }

  ngOnInit() {
  }

  login() {
    this.authservice.login(this.model.username, this.model.password);
  }
  isLoggedIn() {
    return this.authservice.isLoggedIn();
  }

}
