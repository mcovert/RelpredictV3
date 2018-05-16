import { Component, OnInit, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: './home.component3.html',
  styleUrls: ['./home.component2.css']
})
export class HomeComponent implements OnInit {
  // lineChart
  public lineChartData:Array<any> = [
    {data: [31, 59, 60, 61, 56, 55, 40], label: 'Data Batches'},
    {data: [28, 48, 50, 52, 51, 51, 47], label: 'Data Records (1000)'},
    {data: [82, 84, 84, 86, 80, 86, 82], label: 'Accuracy'}
  ];
  public lineChartLabels:Array<any> = [ 'November', 'December', 'January', 'February', 'March', 'April'];
  public lineChartOptions:any = {
    responsive: true,
    title: {
       display: true,
       text: 'Volume and Accuracy'
    }
  };
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'bar';

  public radarChartLabels:string[] = ['Denials', 'Appeals', 'Workflow', 'Revenue'];
  public radarChartData:any = [
    {data: [65, 59, 44, 35], label: 'Volume'},
    {data: [84, 92, 82, 85], label: 'Accuracy'}
  ];
  public radarChartType:string = 'radar';
 
  constructor(private authService : AuthService, private router: Router) {
  }

  ngOnInit() {
  }
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
}
