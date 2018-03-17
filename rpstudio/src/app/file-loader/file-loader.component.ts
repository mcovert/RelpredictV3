import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-file-loader',
  templateUrl: './file-loader.component.html',
  styleUrls: ['./file-loader.component.css']
})
export class FileLoaderComponent implements OnInit {

  @Output() readFile   : EventEmitter<string> = new EventEmitter<string>();
  @Output() cancelFile : EventEmitter<string> = new EventEmitter<string>();

  fileText: string;	

  constructor() { }

  ngOnInit() {
  }

  loadFile(event) {
  	var reader = new FileReader();
  	var file: file = event.target.files[0];
  	console.log(file.name);
  	if (file.name === '')
       this.cancelFile.emit();
    else {
  	   reader.readAsText(file);

  	   reader.onload = (e) => {
         this.fileText = reader.result;
         console.log(this.fileText);
         this.readFile.emit(this.fileText);
  	   }
    }
  }

}
