import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  helpLink = "https://onedrive.live.com/view.aspx?resid=86DB5DCD17B22E08!2364&ithint=file%2cpptx&app=PowerPoint&authkey=!ADUa55wggYQPPK4";
  constructor() { }

  ngOnInit() {
  }
 showHelp() {
  	window.open(this.helpLink, '_blank'); 	
 }
}
