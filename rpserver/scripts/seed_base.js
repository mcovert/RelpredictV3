//
// MongoDB script to seed the base data into the control database
//
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
db.algorithm.drop();
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
db.jobclass.drop();
db.createCollection('jobclass') 
db.jobclass.insertMany(job_classes)