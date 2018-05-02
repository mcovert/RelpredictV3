import { Component, OnInit, Injectable } from '@angular/core';
import { DataService } from '../../services/data.service';
import { GlobalService } from '../../services/global.service';
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
    datafile_fullname: string;
}
class FIRetObj {
	datafile_info    : FileInfo; 
}
class FileHeader {
  datafile_name    : string;
  datafile_header  : string;
  datafile_record  : string;
}
class FHRetObj {
  datafile_content : FileHeader;
}
class Field {
	field_name: string;
    field_val:  string;
    field_type: string;
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
                               datafile_dir: '---',
                               datafile_fullname: '---'}; 
  showFileHeader = false;
  fileHeader : Field[];

  constructor(private dataservice : DataService, private globalservice : GlobalService) { 
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
  getSplitChar(ft) {
  	if (ft == 'TSV') return '\t';
  	if (ft == 'CSV') return ',';
  	return ' ';
  }
  makeHeaders(fh : FileHeader ) {
  	this.fileHeader = [];
  	let splitChar = this.getSplitChar(this.fileInfo.datafile_format);
  	console.log(splitChar);
  	let h = fh.datafile_header.split(splitChar);
  	let d = fh.datafile_record.split(splitChar);
  	for (var i = 0; i < h.length; i++) {
  		this.fileHeader.push({field_name: h[i], 
  			                  field_val: d[i], 
  			                  field_type: this.globalservice.guessDataType(d[i])});
  	}
  }
  displayFileHeader(status) {
  	this.showFileHeader = status;
  	let file = this.fileInfo.datafile_fullname;
  	if (status == true) {
  	  this.dataservice.getDatafileHeader(file).subscribe(result => {
  		  this.makeHeaders(result.datafile_content);
  		  console.log(this.fileHeader);
  	  });
  	}
  }
  onActivateEvent(event) {
  	console.log(event);
  	console.log('Path=' + event.node.data.path);
  	this.dataservice.getDatafileInfo(event.node.data.path).subscribe(result => {
  		console.log(result);
  		this.fileInfo = result.datafile_info;
  		console.log(this.fileInfo);
  		this.displayFileHeader(true);
  	})
  }
}
