import { Component, OnInit, Injectable } from '@angular/core';
import { DataService } from '../../services/data.service';
import { GlobalService } from '../../services/global.service';
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";
import { DatatypeSelectorComponent} from '../../shared/datatype-selector/datatype-selector.component';
import { RPDatamap, RPFieldmap, RPDataType, RPParameterDef } from '../../shared/db-classes';

class TreeNode {
  path     : string;
  name     : string;
  children : TreeNode[];
  size     : number;
  type     : string;
  isExpanded: boolean;
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
  contentsDisplayed = false;
  message : string = "";
  newDatamap : RPDatamap;
  showDMDialog = false;

  constructor(private dataservice : DataService, private globalservice : GlobalService,
              private router: Router) { 
  	this.fileInfo = this.emptyFileInfo;
  }
  ngOnInit() {
  	this.dataservice.getDataDirectory().subscribe(result => {
  		var ro = result as RetObj;
  		this.node = [ro.filedir];
      this.node[0].isExpanded = true;
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
  	let h = fh.datafile_header.split(splitChar);
  	let d = fh.datafile_record.split(splitChar);
  	for (var i = 0; i < h.length; i++) {
      if (d[i].length > 20) d[i] = d[i].substring(0,18) + "...";
  		this.fileHeader.push({field_name: h[i], 
  			                  field_val: d[i], 
  			                  field_type: this.globalservice.guessDataType(d[i])});
  	}
  }
  createNewDataMap() {
    this.newDatamap = new RPDatamap();
    this.showDMDialog = true;
  }
  makeDatamap(dm : RPDatamap) {
    this.fileHeader = [];
    for (var f of dm.fields) {
      this.fileHeader.push({field_name: f.field_name, 
                          field_val: '', 
                          field_type: f.field_type});
    }
  }
  displayFileHeader(status) {
  	this.showFileHeader = status;
  	let file = this.fileInfo.datafile_fullname;
  	if (status == true) {
  	  this.dataservice.getDatafileHeader(file).subscribe(result => {
  		  this.makeHeaders(result.datafile_content);
  	  });
  	}
  	else this.fileHeader = [];
    this.contentsDisplayed = status;
  }
  displayDatamap(status) {
    this.showFileHeader = status;
    let file = this.fileInfo.datafile_fullname;
    if (status == true) {
      this.dataservice.getDatamap(file).subscribe(result => {
        var dm = JSON.parse(result.returned_object);
        this.makeDatamap(dm);
      });
    }
    else this.fileHeader = [];
    this.contentsDisplayed = status;
  }
  onActivateEvent(event) {
  	this.dataservice.getDatafileInfo(event.node.data.path).subscribe(result => {
  		this.fileInfo = result.datafile_info;
  		if (this.fileInfo.datafile_type === 'File') {
          if (this.fileInfo.datafile_format == "datamap")
             this.displayDatamap(true);
          else
  		       this.displayFileHeader(true);
      }
  		else
  		    this.displayFileHeader(false);

  	})
  }
  newType(t: string) {
  	let tokens = t.split("=");
  	for (let i = 0; i < this.fileHeader.length; i++) {
  		if (this.fileHeader[i].field_name == tokens[0]) {
  			this.fileHeader[i].field_type = tokens[1];
  			break;
  		}
  	}
  }
  createDatamap() {
    var datamap = new RPDatamap();
    datamap.datamap_name = this.fileInfo.datafile_name;
    datamap.datamap_type = "map";

    for (var f of this.fileHeader) {
      var fld = new RPFieldmap();
      fld.field_name = f.field_name;
      fld.field_type = f.field_type;
      datamap.fields.push(fld);
    }
    this.dataservice.createDatamap(datamap, this.fileInfo.datafile_dir, true).subscribe(result => {
      this.message = result.returned_object;
      this.ngOnInit();
    });
  }
  createModel() {
    //var fenc = this.globalservice.encode(this.fileInfo.datafile_name);
    //var denc = this.globalservice.encode(JSON.stringify(this.fileHeader));
    //if (this.fileInfo.datafile_format == 'datamap')
    //   this.router.navigate(['model-create', 'datamap', fenc, denc]);
    //else 
    this.router.navigate(['model-create']);
  }
  deleteFile() {
    console.log(this.fileInfo);
    if (window.confirm("Are you sure you wan to delete this item?")) {
      this.dataservice.deleteFile(this.fileInfo.datafile_fullname).subscribe(result => {
         this.message = result.returned_object;
         this.ngOnInit();
      });
    }
  }
  gotoUpload() {
    this.router.navigate(["data-upload"]);
  }
  saveDM() {
    this.dataservice.createDatamap(this.newDatamap, this.fileInfo.datafile_dir, true).subscribe(result => {
      this.message = result.returned_object;
      this.showDMDialog = false;
      this.ngOnInit();
    });
  }
  cancelDM() {
    this.showDMDialog = false;
  }

}