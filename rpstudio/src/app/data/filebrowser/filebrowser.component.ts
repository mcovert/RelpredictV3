import { Component, OnInit, Injectable } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

class TreeNode {
  path     : string;
  name     : string;
  children : TreeNode[];
  size     : number;
  type     : string;
}
class RetObj {
  filedir: TreeNode;
}

@Component({
  selector: 'app-filebrowser',
  templateUrl: './filebrowser.component.html',
  styleUrls: ['./filebrowser.component.css']
})

export class FilebrowserComponent implements OnInit {
  o_node: Observable<TreeNode>;
  node  : TreeNode[];
  options = {};

  constructor(private dataservice : DataService) { 
  }
  ngOnInit() {
  	this.dataservice.getDataDirectory().subscribe(result => {
  		var ro = result as RetObj;
  		console.log(ro.filedir);
  		this.node = [ro.filedir];
  		console.log(this.node);
  	})
  }

}
