import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { RPDataType, RPParameter,    RPFeature,      RPTargetAlgorithm, 
	       RPTarget,   RPModel,        RPAlgorithmDef, RPCurrentModel, 
	       RPLogEntry, RPTrainedModel, RPModelClass, ReturnObject} from '../shared/db-classes';
import { GlobalService } from './global.service';
import { AuthService } from './auth.service';

class ModelWrapper {
  models: RPModel[];
}

class SingleModelWrapper {
  model: RPModel;
}

@Injectable()
export class ModelService {

httpService    : HttpClient;
algorithms     : RPAlgorithmDef[] = [
   { name: "Decision Tree", short_name: "dt", description: "Single decision tree", alg_class: "classifier",
     parms: [ {parm_name: "depth", parm_type: "range", data_type: "integer", description: "Maximum tree depth", 
               min:2, max:9999, step: 1, parm_default: "5"},
              {parm_name: "bins",  parm_type: "range", data_type: "integer", description: "Impurity calculation method", 
               min:8, max:9999, step: 1, parm_default:"32"},
              {parm_name: "impurity", parm_type: "choose", data_type: "string", description: "Number of bins to discretize continuous features (>= max categories)", 
               choose: [ "gini", "entropy", "variance"], parm_default: "gini" }
            ]
   },
   { name: "Random Forest", short_name: "rf", description: "A set of independent decision trees", alg_class: "classifier",
     parms: [ {parm_name: "depth", parm_type: "range", data_type: "integer", description: "Maximum tree depth", 
               min:2, max:9999, parm_default: "5"},
              {parm_name: "trees", parm_type: "range", data_type: "integer", description: "Number of trees", 
               min:2, max:9999, parm_default: "5"}
            ]
   },
   { name: "Gradient Boosted Trees", short_name: "gbt", description: "A sequence of decision trees", alg_class: "classifier",
     parms: [ {parm_name: "depth", parm_type: "range", data_type: "integer", description: "Maximum tree depth", 
               min:2, max:9999, parm_default: "5"},
              {parm_name: "iterations", parm_type: "range", data_type: "integer", description: "Number of iterations (will define the number of trees)", 
               min:2,max:9999,parm_default: "5"}
            ]
   },
   { name: "Support Vector Machine", short_name: "svm", description: "Multi-class support vector machine", alg_class: "classifier",
     parms: [ {parm_name: "iterations", parm_type: "range", data_type: "integer", description: "Number of iterations", 
               min:2,max:9999,parm_default: "100"},
              {parm_name: "regularization", parm_type: "choose", data_type: "string", description: "Regularization method", 
               choose: ["L2", "L1", "ElasticNet"], parm_default: "L2"}
            ]
   },
   { name: "Logistic Regression", short_name: "lr", description: "Logistic regression", alg_class: "classifier",
     parms: [ {parm_name: "iterations", parm_type: "range", data_type: "integer", description: "Number of iterations", 
               min:2, max:9999, parm_default: "100"}
            ]
   },
   { name: "Naive Bayes", short_name: "nb", description: "Multinomial Naive Bayes", alg_class: "classifier",
     parms: [ {parm_name: "smoothing", parm_type: "range", data_type: "double", description: "Lambda smoothing", 
               min:0.1, max:5.0, parm_default: "1.0"},
              {parm_name: "model_type", parm_type: "choose", data_type: "string", description: "Distribution estimation method", 
               choose: ["bernoulli", "multinomial"], parm_default: "bernoulli"}
            ]
   },
   { name: "Neural Network", short_name: "nn", description: "Neural Network", alg_class: "classifier",
     parms: [ {parm_name: "network", parm_type: "value", data_type: "string", description: "Network shape (level/size,leve/size...)", 
               parm_default: "1/100"}
            ]
   },
]; 

modelclasses   : Observable<RPModelClass[]>;
models         : Observable<ModelWrapper>;
current_models : Observable<RPCurrentModel[]>;
log            : Observable<RPLogEntry[]>;
trained_models : Observable<RPTrainedModel[]>;
url            : string;
httpOptions    : HttpHeaders; 

  constructor(private http: HttpClient, private authService: AuthService, private globalService: GlobalService) { 
      this.httpService = http;
      this.url = this.authService.getServerUrl();
      console.log("Model service created using server at " + this.url );
  }

  getDataTypes()  : RPDataType[] { 
    return this.globalService.getDataTypes();
  }
  getAlgorithmDefs()  : RPAlgorithmDef[] { 
    return this.algorithms;
  }
  getModels() : Observable<ModelWrapper> { 
    this.models = this.httpService.get(this.authService.addAccessTokenToURL('http://ai25:3000/api/models/listmodels')) as Observable<ModelWrapper>;
    return this.models;
  }
  getModels_orig() : Observable<RPModel[]> { 
    return this.httpService.get(this.authService.addAccessTokenToURL('http://ai25:3000/api/models/models')) as Observable<RPModel[]>;
  }
  getModelClasses() : Observable<RPModelClass[]> {
    this.modelclasses = this.httpService.get(this.authService.addAccessTokenToURL(this.url + 'modelclasses')) as Observable<RPModelClass[]>;
    return this.modelclasses;
  }
  getModelById(id : string) : Observable<RPModel> {
     return this.httpService.get(this.authService.addAccessTokenToURL(this.url + 'models/' + id)) as Observable<RPModel>;
  }
  getModelByName(name: string) :Observable<SingleModelWrapper> {
     var parts = name.split("\/");
     console.log(parts);
     return this.httpService.post(this.authService.addAccessTokenToURL('http://ai25:3000/api/models/getmodel'), 
       JSON.stringify({ model_class: parts[0], model_name: parts[1], model_version: parts[2]})) as Observable<SingleModelWrapper>;     
  }
  getTrainedModels() : Observable<RPTrainedModel[]> {
    this.trained_models = this.httpService.get(this.authService.addAccessTokenToURL(this.url + 'trainedmodels')) as Observable<RPTrainedModel[]>;
    return this.trained_models;
  }
  createModel(model : RPModel, overwrite: boolean) {
    delete model.id;
    return this.httpService.post(this.authService.addAccessTokenToURL('http://ai25:3000/api/models/createmodel'), {model: model, overwrite: overwrite}) as Observable<ReturnObject>;    
  }
  updateModel(model : RPModel) {
    return this.httpService.put(this.authService.addAccessTokenToURL(this.url + 'models/' + model.id), JSON.stringify(model));
  }
  deleteModel(id : string) {
    return this.httpService.delete(this.authService.addAccessTokenToURL(this.url + 'models/' + id));
  }

  getDefaultAlgorithmDef() : RPAlgorithmDef {
    return this.algorithms[0];
  }
  getAlgorithmDef(algname: string) : RPAlgorithmDef {
    for (var alg of this.algorithms) {
      if (alg.name == algname)
         return alg;
    }
    return this.getDefaultAlgorithmDef();
  }
  getAlgorithmDefByShortName(algname: string) : RPAlgorithmDef {
    for (var alg of this.algorithms) {
      if (alg.short_name == algname)
         return alg;
    }
    return this.getDefaultAlgorithmDef();
  }
  createTargetAlgorithm(algd: RPAlgorithmDef) : RPTargetAlgorithm {
    var ta = new RPTargetAlgorithm();
    ta.name        = algd.name;
    ta.short_name  = algd.short_name;
    ta.description = algd.description;
    ta.parms       = [];
    for (var p of algd.parms) {
      var ap = new RPParameter(p.parm_name, p.parm_default, p.data_type);
      ta.parms.push(ap);
    }
    return ta;    
  }
  getScript(model: RPModel) : Observable<ReturnObject> {
    let body = JSON.stringify({ model: model});
    return this.httpService.post(this.authService.addAccessTokenToURL(this.url + 'models/convert'), body) as Observable<ReturnObject>;

  }
 }
