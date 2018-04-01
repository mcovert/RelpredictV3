import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-datafile-uploader',
  templateUrl: './datafile-uploader.component.html',
  styleUrls: ['./datafile-uploader.component.css']
})
export class DatafileUploaderComponent implements OnInit {

  filesToUpload: Array<File> = [];	
  fMsg: string = "No files selected";

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  upload() {
  	this.dataService.uploadFiles(this.filesToUpload);
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
