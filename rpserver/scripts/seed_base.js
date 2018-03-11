//
// MongoDB script to seed the base data into the control database
//
var datatypes = [
   { name : "integer", short_name : "int",     description : "Long integer"},
   { name : "double",  short_name : "double",  description : "Double precision floating point number"},
   { name : "boolean", short_name : "boolean", description : "true or false boolean"},
   { name : "string",  short_name : "string",  description : "Single string value"},
   { name : "text",    short_name : "text",    description : "Multiple delimited string values"},
];
db.datatype.drop();
db.createCollection('datatype');
db.datatype.insertMany(datatypes);
var roles = [
   { name: "admin", description: "Full administrator" },
   { name: "data_admin", description: "Data administrator" },
   { name: "job_admin", description: "Job administrator" },
   { name: "model_design", description: "Model designer" },
   { name: "model_admin", description: "Model administrator" }
];
db.createCollection('role')
db.role.insertMany(roles)
var algorithms = [
   { name: "Decision Tree", short_name: "dt", description: "Single decision tree", model_class: "classifier",
     parms: [ {name: "depth", type: "integer", description: "Maximum tree depth", def: "min:2,max:9999,default:5"},
              {name: "bins", type: "integer", description: "Impurity calculation method", def: "min:8,max:9999,default:32"},
              {name: "impurity", type: "string", description: "Number of bins to discretize continuous features (>= max categories)", def: "choose:gini,entropy,variance", default: "gini"}
            ]
   },
   { name: "Random Forest", short_name: "rf", description: "A set of independent decision trees", model_class: "classifier",
     parms: [ {name: "depth", type: "integer", description: "Maximum tree depth", def: "min:2, max:9999, default: 5"},
              {name: "trees", type: "integer", description: "Number of trees", def: "min:2, max:9999, default:5"}
            ]
   },
   { name: "Gradient Boosted Trees", short_name: "gbt", description: "A sequence of decision trees", model_class: "classifier",
     parms: [ {name: "depth", type: "integer", description: "Maximum tree depth", def: "min:2,max:9999,default:5"},
              {name: "iterations", type: "integer", description: "Number of iterations (will define the number of trees)", def: "min:2,max:9999,default:5"}
            ]
   },
   { name: "Support Vector Machine", short_name: "svm", description: "Multi-class support vector machine", model_class: "classifier",
     parms: [ {name: "iterations", type: "integer", description: "Number of iterations", def: "min:2,max:9999,default:100"},
              {name: "regularization", type: "string", description: "Regularization method", def: "choose:L1;L2;ElasticNet,default:L2"}
            ]
   },
   { name: "Logistic Regression", short_name: "lr", description: "Logistic regression", model_class: "classifier",
     parms: [ {name: "iterations", type: "integer", description: "Number of iterations", def: "min:2,max:9999,default:100"}
            ]
   },
   { name: "Naive Bayes", short_name: "nb", description: "Multinomial Naive Bayes", model_class: "classifier",
     parms: [ {name: "smoothing", type: "double", description: "Lambda smoothing", def: "min:0.1,max:5.0,default:1.0"},
              {name: "model_type", type: "string", description: "Distribution estimation method", def: "choose:bernoulli;multinomial, default:bernoulli"}
            ]
   },
   { name: "Neural Network", short_name: "nn", description: "Neural Network", model_class: "classifier",
     parms: [ {name: "network", type: "string", description: "Network shape (level/size,leve/size...)", def: "default:1/100"}
            ]
   },
]; 
db.createCollection('algorithm')
db.algorithm.insertMany(algorithms)
var job_classes = [
   { name: "train", description: "Model training",
     parms: []},
   { name: "predict", description: "Model prediction",
     parms: []},
   { name: "data_management", description: "Data management",
     parms: []},
   { name: "report", description: "Reporting",
     parms: []}
];
db.createCollection('jobclass') 
db.jobclass.insertMany(job_classes)