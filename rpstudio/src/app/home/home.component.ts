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
  templateUrl: './home.component2.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  topics: Topic[] = [
     { title: "Models", color: "red", icon: "fa fa-cubes", items: [
           { title: "Create models", 
             icon: "fa fa-cubes", 
             text: "Create models using data, data maps, another model, or from scratch",
             link: "/models"
           },
           { title: "Train, test, and predict", 
             icon: "fa fa-cubes", 
             text: "Train and test a model and use it for prediction",
             link: "/models"
           },
           { title: "Manage models", 
             icon: "fa fa-cubes", 
             text: "Rename, delete, analyze, and promote models into production",
             link:  "/models"
           }]
     },
     { title: "Data", color: "blue", icon: "fa fa-cubes", items: [
           { title: "Manage your data", 
             icon: "fa fa-cubes", 
             text: "Upload, rename, and delete data batches or individual files",
             link:  "/data"
           }]
     },
     { title: "Jobs", color: "green", icon: "fa fa-cubes", items: [
           { title: "Manage your jobs", 
             icon: "fa fa-cubes", 
             text: "Submit and schedule jobs for execution",
             link: "/data"
           },
           { title: "Job status", 
             icon: "fa fa-cubes", 
             text: "Review job status and logs",
             link:  "/data"
           }]
     },
     { title: "System", color: "blue", icon: "fa fa-cubes", items: [
           { title: "Manage users and roles", 
             icon: "fa fa-cubes", 
             text: "Add and suspend users and assign them roles",
             link:  "/data"
           },
           { title: "System log", 
             icon: "fa fa-cubes", 
             text: "Review the system log",
             link:  "/data"
           },
           { title: "Shutdown", 
             icon: "fa fa-cubes", 
             text: "Shut the system down",
             link:  "/data"
           }]
     }
  ];

  constructor(private authService : AuthService, private router: Router) {
  }

  ngOnInit() {
  }
}
