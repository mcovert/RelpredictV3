import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { GlobalService } from './global.service';

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
class HttpOptions {
  headers: HttpHeaders;
}
@Injectable()
export class AuthService {

  user : LoggedInUser;
  loggedIn = false;
  url : string;
  httpOptions : HttpOptions;
  httpOptionsX: HttpOptions;

  constructor(private http: HttpClient, private globalService: GlobalService) { 
    console.log("New auth service created"); 
    this.url = this.globalService.getServerUrl();
  }

  login(email: string, password: string) {
    if (this.loggedIn == true) {
       return;
    }
    else {
       this.http.post<LoginResponse>(this.url + 'Users/login', {
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
            this.httpOptions = { 'headers': new HttpHeaders( { 'Content-Type': 'application/json',
                                                               'authorization': this.user.token } ) };
            this.httpOptionsX= { 'headers': new HttpHeaders( { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                                               'authorization': this.user.token } ) };
          });
    }
  }
  getServerUrl() {
    return this.globalService.getServerUrl();
  }
  getHttpHeader() {
    console.log('Getting headers ', this.httpOptions.headers);
    return this.httpOptions;
  }
  getHttpHeaderX() {
    console.log('Getting headers ', this.httpOptionsX.headers);
    return this.httpOptionsX;
  }
  getUsername() {
    if (!this.isLoggedIn())
     return "Not logged in";
    else return this.user.username;
  }
  getRole() {
    if (!this.isLoggedIn())
     return "";
    else return this.user.role;
  }

  getUsernameAndRole() {
    if (!this.isLoggedIn())
     return "Not logged in";
    else return this.user.username + " (" + this.user.role + ")";
  }

  logout() {
    this.loggedIn = false;
    this.httpOptions.headers.delete('authorization');
  }

  isLoggedIn() : boolean {
    return this.loggedIn;
  }
  addAccessTokenToURL(url: string) {
    return url + "?access_token=" + this.user.token;
  }
}
