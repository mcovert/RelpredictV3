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
class FileInfo {
	datafile_name    : string;
	datafile_size    : number;
	datafile_created : string;
    datafile_format  : string;
    datafile_type    : string;
    datafile_dir     : string;
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
  fileInfo : FileInfo;
  emptyFileInfo : FileInfo = { datafile_name: '---', 
                               datafile_size: 0, 
                               datafile_created: '---', 
                               datafile_format: '---', 
                               datafile_type: '---',
                               datafile_dir: '---'}; 

  constructor(private dataservice : DataService) { 
  	this.fileInfo = this.emptyFileInfo;
  }
  ngOnInit() {
  	this.dataservice.getDataDirectory().subscribe(result => {
  		var ro = result as RetObj;
  		console.log(ro.filedir);
  		this.node = [ro.filedir];
  		console.log(this.node);
  	})
  }
  onEvent(event) {
  }
  onActivateEvent(event) {
  	console.log(event);
  	console.log('Path=' + event.node.data.path);
  	this.dataservice.getDatafileInfo(event.node.data.path).subscribe(result => {
  		console.log(result);
  		this.fileInfo = (result.datafile_info) as FileInfo;
  		console.log(this.fileInfo);
  	})
  }
}
