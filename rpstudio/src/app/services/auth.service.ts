import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface LoginResponse {
  id: string;
  ttl: string;
  created: string;
  userId: string;
}
class LoggedInUser {
  username: string;
  role: string;
  token: string;
}
@Injectable()
export class AuthService {

  user : LoggedInUser;
  loggedIn = false;

  constructor(private http: HttpClient) { console.log("New auth service created"); }

  login(email: string, password: string) {
    if (this.loggedIn == true) {
       return;
    }
    else {
       this.http.post<LoginResponse>('http://ai25:3000/api/Users/login', {
             email: email, password: password
       }).subscribe(data => {
            console.log(data);
            var login_resp = <LoginResponse> data;
            console.log("id: " + login_resp.id);
            console.log("ttl: " + login_resp.ttl);
            console.log("created: " + login_resp.created);
            console.log("userId: " + login_resp.userId);
            this.user = new LoggedInUser();
            this.user.username = email;
            this.user.role = "admin";
            this.user.token = login_resp.id;
            this.loggedIn = true;
          });
    }
  }
  getUserToken() {
    return this.user.token;
  }
  getUsername() {
    if (!this.loggedIn)
     return "Not logged in";
    else return this.user.username;
  }
  getRole() {
    if (!this.loggedIn)
     return "";
    else return this.user.role;
  }

  getUsernameAndRole() {
    if (!this.loggedIn)
     return "Not logged in";
    else return this.user.username + " (" + this.user.role + ")";
  }

  logout() {
    this.loggedIn = false;
  }

  isLoggedIn() : boolean {
    return this.loggedIn;
  }

}
