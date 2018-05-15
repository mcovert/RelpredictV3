import { Component, OnInit, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";

class TopicItem {
	title: string;
	icon:  string;
	text:  string;
    link:  string;
}
class Topic {
    title: string;
    color: string;
    icon:  string;
    items: TopicItem[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component3.html',
  styleUrls: ['./home.component2.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService : AuthService, private router: Router) {
  }

  ngOnInit() {
  }
}
