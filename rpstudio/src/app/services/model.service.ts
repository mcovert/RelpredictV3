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
   { datatype_name : "integer", short_name : "int",     description : "Long integer",
     parms: [{ parm_name: "bucket", parm_type: "value", data_type: "integer", description: "Bucket numbers", label: "Number of buckets", parm_default: "0"}]},
   { datatype_name : "double",  short_name : "double",  description : "Double precision floating point number",
     parms: [{ parm_name: "bucket", parm_type: "value", data_type: "integer", description: "Bucket numbers", label: "Number of buckets", parm_default: "0"}]},
   { datatype_name : "boolean", short_name : "boolean", description : "true or false boolean", parms: []},
   { datatype_name : "string",  short_name : "string",  description : "Single string value",
     parms: [{ parm_name: "case", parm_type: "choose", data_type: "string",  description: "Change case", label: "Translate Case", choose: ["none", "upper", "lower"], parm_default: "none"},
             { parm_name: "encode", parm_type: "choose", data_type: "string",description: "Encoding option", label: "Encode as", choose: ["category", "one-hot"], parm_default: "category"}]},
   { datatype_name : "text",    short_name : "text",    description : "Multiple delimited string values",
     parms: [{ parm_name: "dlm", parm_type: "choose", data_type: "integer",   description: "Bucket numbers", label: "Delimiter", choose: ["comma", "space", "pipe", "tab"], parm_default: "tab"},
             { parm_name: "case", parm_type: "choose", data_type: "string",  description: "Change case", label: "Change Case to", choose: ["none", "upper", "lower"], parm_default: "none"}]}
];
algorithms     : RPAlgorithmDef[] = [
   { name: "Decision Tree", short_name: "dt", description: "Single decision tree", model_class: "classifier",
     parms: [ {parm_name: "depth", parm_type: "range", data_type: "integer", description: "Maximum tree depth", 
               min:2, max:9999, step: 1, default: "5"},
              {parm_name: "bins",  parm_type: "range", data_type: "integer", description: "Impurity calculation method", 
               min:8, max:9999, step: 1, default:"32"},
              {parm_name: "impurity", parm_type: "choose", data_type: "string", description: "Number of bins to discretize continuous features (>= max categories)", 
               choose: [ "gini", "entropy", "variance"], default: "gini" }
            ]
   },
   { name: "Random Forest", short_name: "rf", description: "A set of independent decision trees", model_class: "classifier",
     parms: [ {parm_name: "depth", data_type: "integer", description: "Maximum tree depth", 
               min:2, max:9999, default: "5"},
              {parm_name: "trees", type: "integer", description: "Number of trees", 
               min:2, max:9999, default: "5"}
            ]
   },
   { name: "Gradient Boosted Trees", short_name: "gbt", description: "A sequence of decision trees", model_class: "classifier",
     parms: [ {parm_name: "depth", parm_type: "range", data_type: "integer", description: "Maximum tree depth", 
               min:2, max:9999, default: "5"},
              {parm_name: "iterations", parm_type: "range", type: "integer", description: "Number of iterations (will define the number of trees)", 
               min:2,max:9999,default: "5"}
            ]
   },
   { name: "Support Vector Machine", short_name: "svm", description: "Multi-class support vector machine", model_class: "classifier",
     parms: [ {parm_name: "iterations", parm_type: "range", data_type: "integer", description: "Number of iterations", 
               min:2,max:9999,default:100},
              {parm_name: "regularization", parm_type: "choose", data_type: "string", description: "Regularization method", 
               choose: ["L1", "L2", "ElasticNet"], default: "L2"}
            ]
   },
   { name: "Logistic Regression", short_name: "lr", description: "Logistic regression", model_class: "classifier",
     parms: [ {parm_name: "iterations", parm_type: "range", data_type: "integer", description: "Number of iterations", 
               min:2, max:9999, default: "100"}
            ]
   },
   { name: "Naive Bayes", short_name: "nb", description: "Multinomial Naive Bayes", model_class: "classifier",
     parms: [ {parm_name: "smoothing", parm_type: "range", data_type: "double", description: "Lambda smoothing", 
               min:0.1, max:5.0, default:1.0},
              {parm_name: "model_type", data_type: "string", description: "Distribution estimation method", 
               choose: ["bernoulli", "multinomial"], default: "bernoulli"}
            ]
   },
   { name: "Neural Network", short_name: "nn", description: "Neural Network", model_class: "classifier",
     parms: [ {parm_name: "network", parm_type: "value", data_type: "string", description: "Network shape (level/size,leve/size...)", 
               default: "1/100"}
            ]
   },
]; 

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
  getAlgorithmDefs()  : RPAlgorithmDef[] { 
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
