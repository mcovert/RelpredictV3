import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { RPDataType, RPParameter,    RPFeature,      RPTargetAlgorithm, 
	     RPTarget,   RPModel,        RPAlgorithmDef, RPCurrentModel, 
	     RPLogEntry, RPTrainedModel, RPModelClass} 
    from '../shared/db-classes';

@Injectable()
export class ModelService {

httpService    : HttpClient;
datatypes      : RPDataType[] = [
   { datatype_name : "integer", short_name : "int",     description : "Long integer"},
   { datatype_name : "double",  short_name : "double",  description : "Double precision floating point number"},
   { datatype_name : "boolean", short_name : "boolean", description : "true or false boolean"},
   { datatype_name : "string",  short_name : "string",  description : "Single string value"},
   { datatype_name : "text",    short_name : "text",    description : "Multiple delimited string values"}
];
algorithms     : Observable<RPAlgorithmDef[]>;
modelclasses   : Observable<RPModelClass[]>;
models         : Observable<RPModel[]>;
current_models : Observable<RPCurrentModel[]>;
log            : Observable<RPLogEntry[]>;
trained_models : Observable<RPTrainedModel[]>;

httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

  constructor(private http: HttpClient) { 
      this.httpService = http;
      console.log("Model service created...");
  }

  getDataTypes()  : RPDataType[] { 
    return this.datatypes;
  }
  getAlgorithmDefs()  : Observable<RPAlgorithmDef[]> { 
    this.algorithms = this.httpService.get('http://ai25:3000/api/algorithms') as Observable<RPAlgorithmDef[]>;
    return this.algorithms;
  }
  getModels() : Observable<RPModel[]> { 
    this.models = this.httpService.get('http://ai25:3000/api/models') as Observable<RPModel[]>;
    return this.models;
  }
  getModelClasses() : Observable<RPModelClass[]> {
    this.modelclasses = this.httpService.get('http://ai25:3000/api/modelclasses') as Observable<RPModelClass[]>;
    return this.modelclasses;
  }
  getModelById(id : string) : Observable<RPModel> {
     return this.httpService.get('http://ai25:3000/api/models/' + id) as Observable<RPModel>;
  }
  getTrainedModels() : Observable<RPTrainedModel[]> {
    this.trained_models = this.httpService.get('http://ai25:3000/api/trainedmodels') as Observable<RPTrainedModel[]>;
    return this.trained_models;
  }
  createModel(model : RPModel) {
    this.httpService.post('http://ai25:3000/api/models', JSON.stringify(model), this.httpOptions);
  }
  updateModel(model : RPModel) {
    this.httpService.put('http://ai25:3000/api/models/' + model.id, JSON.stringify(model), this.httpOptions);
  }
  deleteModel(model : RPModel) {
    if (confirm("Are you sure you want to delete this model?")) {
       this.httpService.post('http://ai25:3000/api/models/' + model.id, JSON.stringify(model), this.httpOptions);
    }
  }
 }
