import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { DataService } from '../../services/data.service';
import { RPDatafile, RPBatch, RPDataType, RPDatamap, RPFieldmap, RPModelTemplate, RPFieldTemplate, RPModelClass} from '../../shared/db-classes';
import { Router } from "@angular/router";

@Component({
  selector: 'app-datafile-uploader',
  templateUrl: './datafile-uploader.component.html',
  styleUrls: ['./datafile-uploader.component.css']
})
export class DatafileUploaderComponent implements OnInit {

  filesToUpload: Array<File> = [];	
  fMsg: string = "";
  dm: RPDatamap = new RPDatamap();
  showDMDialog: boolean = false;
  mode: string = 'file';

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
  }

  upload() {
  	this.fMsg = "Upload started...";
  	this.dataService.uploadFiles(this.filesToUpload).subscribe(
           res => {
              console.log(res);
              this.fMsg = "Upload completed successfully";
              setTimeout(() => this.router.navigate(['data']), 2000);      
           },
           err => {
              console.log("Error occured");
              this.fMsg = "Upload failed";
           });

  }

  fileChangeEvent(fileInput: any) {
  	console.log(document.getElementById('cin'));
  	for (var f of <Array<File>>fileInput.target.files) {
       this.filesToUpload.push(f);
    }
    this.fMsg = this.filesToUpload.length + " selected";
  }
  getFileType(fname: string) {
  	return fname.split('.').pop();
  }
  removeFile(i: number) {
  	this.filesToUpload.splice(i, 1);
    this.fMsg = this.filesToUpload.length + " selected";
  }
}
