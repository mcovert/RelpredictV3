var config = {
	account:       "Quadax",
	account_id:    "QDX",
	active:        true,
	start_date:    "2016-10-01",
	end_date:      "2055-12-21",
	created_by:    "mcovert",
    created_date:  "2018-01-15",
    modified_date: "2018-01-15"
};
db.config.drop();
db.createCollection('config');
db.config.insertOne(config);

var model_classes = [
    { class_name: 'claim_denial',
      label:      'Claim Denial',
      description:'Models related to claims that are likely to be denied by one or more payers' 
    },
    { class_name: 'claim_appeal',
      label:      'Claim Appeal',
      description:'Models related to claims that are likely to end up in an appeal' 
    },
    { class_name: 'workflow',
      label:      'Workflow',
      description:'Models related to claim processing workflows' 
    },
    { class_name: 'financial_performance',
      label:      'Financial Performance',
      description:'Models related to the financial performance of claimants, payers, and plans' 
    }
];
db.modelclass.drop();
db.createCollection('modelclass');
db.modelclass.insertMany(model_classes);

var models = [
    { name: "claim_denial", description: "Claims likely to be denied",  version: 1, model_class: "claim", identifier: "claim_id", current: false,
      features: [
         { name: "claim_amount", type: "double", label: "Claim Amount", parms: [] },
         { name: "payee", type: "string", label: "Payee", parms: [] },
         { name: "payer", type: "string", label: "Payer", parms: [] },
         { name: "cpt_codes", type: "text", label: "CPT/HCPCS Codes", parms: [ { parm: "encode", parm_value: "ohc" } ] },
         { name: "diagnosis_codes", type: "string", label: "Diagnosis (ICD-10) Codes", parms: [ { parm: "encode", parm_value: "mhc"} ] },
         { name: "insurance_type", type: "string", label: "Insurance Type Code", parms: [] },
         { name: "days_since_submitted", type: "integer", label: "Number of days since submitted", parms: [] },
         { name: "facility_type", type: "string", label: "Place of service facility type", parms: [] },
         { name: "location", type: "string", label: "City, state, and zip code", parms: [] }
      ],
      targets: [
         { name: "status", type: "string", description: "Claim outcome",
           algorithms: [
              { algorithm: "dt",  parms: [ { parm: "depth", parm_value: "5" } ] }
           ]
         }
      ],
      notes: []
    },
    { name: "claim_denial", description: "Claims likely to be denied",  version: 2, model_class: "claim", identifier: "claim_id", current: false,
      features: [
         { name: "claim_amount", type: "double", label: "Claim Amount", parms: [] },
         { name: "payee", type: "string", label: "Payee", parms: [] },
         { name: "payer", type: "string", label: "Payer", parms: [] },
         { name: "cpt_codes", type: "text", label: "CPT/HCPCS Codes", parms: [ { parm: "encode", parm_value: "ohc" } ] },
         { name: "diagnosis_codes", type: "string", label: "Diagnosis (ICD-10) Codes", parms: [ { parm: "encode", parm_value: "mhc"} ] },
         { name: "insurance_type", type: "string", label: "Insurance Type Code", parms: [] },
         { name: "days_since_submitted", type: "integer", label: "Number of days since submitted", parms: [] },
         { name: "facility_type", type: "string", label: "Place of service facility type", parms: [] },
         { name: "location", type: "string", label: "City, state, and zip code", parms: [] }
      ],
      targets: [
         { name: "status", type: "string", description: "Claim outcome",
           algorithms: [
              { algorithm: "dt",  parms: [ { parm: "depth", parm_value: "5" } ] },
              { algorithm: "rf",  parms: [ { parm: "depth", parm_value: "5"}, {parm: "trees", parm_value: "7" } ] },
              { algorithm: "gbt", parms: [ { parm: "depth", parm_value: "5 "} ] },
              { algorithm: "lr",  parms: [ { parm: "iterations", parm_value: "5" } ] }                           
           ]
        }
      ],
      notes: []
    },
    { name: "claim_denial", description: "Claims likely to be denied",  version: 3, model_class: "claim", identifier: "claim_id", current: false,
      features: [
         { name: "claim_amount", type: "double", label: "Claim Amount", parms: [] },
         { name: "payee", type: "string", label: "Payee", parms: [] },
         { name: "payer", type: "string", label: "Payer", parms: [] },
         { name: "cpt_codes", type: "text", label: "CPT/HCPCS Codes", parms: [ { parm: "encode", parm_value: "ohc" } ] },
         { name: "diagnosis_codes", type: "string", label: "Diagnosis (ICD-10) Codes", parms: [ { parm: "encode", parm_value: "mhc"} ] },
         { name: "insurance_type", type: "string", label: "Insurance Type Code", parms: [] },
         { name: "days_since_submitted", type: "integer", label: "Number of days since submitted", parms: [] },
         { name: "facility_type", type: "string", label: "Place of service facility type", parms: [] },
         { name: "location", type: "string", label: "City, state, and zip code", parms: [] }
      ],
      targets: [
         { name: "status", type: "string", description: "Claim outcome",
           algorithms: [
              { algorithm: "dt",  parms: [ { parm: "depth", parm_value: "5" } ] },
              { algorithm: "rf",  parms: [ { parm: "depth", parm_value: "5"}, {parm: "trees", parm_value: "7" } ] },
              { algorithm: "gbt", parms: [ { parm: "depth", parm_value: "5 "} ] },
              { algorithm: "lr",  parms: [ { parm: "iterations", parm_value: "5" } ] },                            
              { algorithm: "svm", parms: [ { parm: "iterations", parm_value: "1000"},{ parm: "regularization", parm_value: "L2" } ] },                            
              { algorithm: "nb",  parms: [ { parm: "smoothing", parm_value: "1.0"}, { parm: "model_type", parm_value: "bernoulli" } ] },                            
              { algorithm: "nn",  parms: [ { parm: "network", parm_value: "1/50,2/100,3/50" } ] }                            
           ]
        }
      ],
      notes: []
    },
    { name: "claim_denial", description: "Claims likely to be denied",  version: 4, model_class: "claim", identifier: "claim_id",  current: true,
      features: [
         { name: "claim_amount", type: "double", label: "Claim Amount", parms: [] },
         { name: "payee", type: "string", label: "Payee", parms: [] },
         { name: "payer", type: "string", label: "Payer", parms: [] },
         { name: "cpt_codes", type: "text", label: "CPT/HCPCS Codes", parms: [ { parm: "encode", parm_value: "mhc"} ] },
         { name: "modifer_codes", type: "text", label: "CPT/HCPCS Modifier Codes", parms: [ { parm: "encode", parm_value: "mhc" } ] },
         { name: "diagnosis_codes", type: "string", label: "Diagnosis (ICD-10) Codes", parms: [ { parm: "encode", parm_value: "mhc" } ] },
         { name: "insurance_type", type: "string", label: "Insurance Type Code", parms: [] },
         { name: "days_since_submitted", type: "integer", label: "Number of days since submitted", parms: [] },
         { name: "facility_type", type: "string", label: "Place of service facility type", parms: [] },
         { name: "location", type: "string", label: "City, state, and zip code", parms: [] }
      ],
      targets: [
         { name: "status", type: "string", description: "Claim outcome",
           algorithms: [
              { algorithm: "dt",  parms: [ { parm: "depth", parm_value: "5" } ] },
              { algorithm: "rf",  parms: [ { parm: "depth", parm_value: "5"}, {parm: "trees", parm_value: "7" } ] },
              { algorithm: "gbt", parms: [ { parm: "depth", parm_value: "5 "} ] },
              { algorithm: "lr",  parms: [ { parm: "iterations", parm_value: "5" } ] },                            
              { algorithm: "svm", parms: [ { parm: "iterations", parm_value: "1000"},{ parm: "regularization", parm_value: "L2" } ] },                            
              { algorithm: "nb",  parms: [ { parm: "smoothing", parm_value: "1.0"}, { parm: "model_type", parm_value: "bernoulli" } ] },                            
              { algorithm: "nn",  parms: [ { parm: "network", parm_value: "1/50,2/100,3/50" } ] }                            
           ]
        },
        { name: "days_to_pay", type: "string", description: "Days to pay",
           algorithms: [
              { algorithm: "dt",  parms: [ { parm: "depth", parm_value: "5" } ] },
              { algorithm: "rf",  parms: [ { parm: "depth", parm_value: "5" }, { parm: "trees", parm_value: "7" } ] },
              { algorithm: "gbt", parms: [ { parm: "depth", parm_value: "5" } ] },
              { algorithm: "lr",  parms: [ { parm: "iterations", parm_value: "5" } ] },                            
              { algorithm: "svm", parms: [ { parm: "iterations", parm_value: "1000" },{ parm: "regularization", parm_value: "L2" } ] },                            
              { algorithm: "nb",  parms: [ { parm: "smoothing", parm_value: "1.0" },{ parm: "model_type", parm_value: "bernoulli" } ] },                            
              { algorithm: "nn",  parms: [ { parm: "network", parm_value: "1/50,2/100,3/50" } ] }                           
           ]
        },
        { name: "payment", type: "string", description: "Expected payment",
           algorithms: [
              { algorithm: "dt",  parms: [ { parm: "depth", parm_value: "5" } ] },
              { algorithm: "rf",  parms: [ { parm: "depth", parm_value: "5"},{ parm: "trees", parm_value: "7" } ] },
              { algorithm: "gbt", parms: [ { parm: "depth", parm_value: "5" } ] },
              { algorithm: "lr",  parms: [ { parm: "iterations", parm_value: "5" } ] },                            
              { algorithm: "svm", parms: [ { parm: "iterations", parm_value: "1000" },{ parm: "regularization", parm_value: "L2" } ] },                            
              { algorithm: "nb",  parms: [ { parm: "smoothing", parm_value: "1.0"},{ parm: "model_type", parm_value: "bernoulli" } ] },                            
              { algorithm: "nn",  parms: [ { parm: "network", parm_value: "1/50,2/100,3/50" } ] }                          
           ]
        }
      ],
      notes: []
    },
    { name: "claim_appeal", description: "Claims likely to be appealed",  version: 1, model_class: "claim", identifier: "claim_id",  current: false,
      features: [
         { name: "claim_amount", type: "double", label: "Claim Amount", parms: []},
         { name: "payee", type: "string", label: "Payee", parms: []},
         { name: "payers", type: "text", label: "Payers", parms: [ { encode: "mhc" }]},
         { name: "cpt_codes", type: "text", label: "CPT/HCPCS Codes", parms: [ { parm: "encode", parm_value: "mhc"}]},
         { name: "diagnosis_codes", type: "string", label: "Diagnosis (ICD-10) Codes", parms: [ { parm: "encode", parm_value: "mhc"}]},
         { name: "insurance_type", type: "string", label: "Insurance Type Code", parms: []},
         { name: "days_since_submitted", type: "integer", label: "Number of days since submitted", parms: []},
         { name: "facility_type", type: "string", label: "Place of service facility type", parms: []},
         { name: "location", type: "string", label: "City, state, and zip code", parms: [] }
      ],
      targets: [
         { name: "status", type: "string", description: "Claim appeal outcome",
           algorithms: [
              { algorithm: "dt",  parms: [ { parm: "depth", parm_value: "5" } ] },
              { algorithm: "rf",  parms: [ { parm: "depth", parm_value: "5"},{ parm: "trees", parm_value: "7" } ] },
              { algorithm: "gbt", parms: [ { parm: "depth", parm_value: "5" } ] }
           ]
        }
      ],
      notes: []
    },
    { name: "claim_appeal", description: "Claims likely to be appealed",  version: 2, model_class: "claim", identifier: "claim_id",  current: true,
      features: [
         { name: "claim_amount", type: "double", label: "Claim Amount", parms: []},
         { name: "payee", type: "string", label: "Payee", parms: []},
         { name: "payers", type: "text", label: "Payers", parms: [ { encode: "mhc" }]},
         { name: "cpt_codes", type: "text", label: "CPT/HCPCS Codes", parms: [ { parm: "encode", parm_value: "mhc"}]},
         { name: "modifer_codes", type: "text", label: "CPT/HCPCS Modifier Codes", parms: [ { parm: "encode", parm_value: "mhc"}]},
         { name: "diagnosis_codes", type: "string", label: "Diagnosis (ICD-10) Codes", parms: [ { parm: "encode", parm_value: "mhc"}]},
         { name: "insurance_type", type: "string", label: "Insurance Type Code", parms: []},
         { name: "days_since_submitted", type: "integer", label: "Number of days since submitted", parms: []},
         { name: "facility_type", type: "string", label: "Place of service facility type", parms: []},
         { name: "location", type: "string", label: "City, state, and zip code", parms: [] }
      ],
      targets: [
         { name: "status", type: "string", description: "Claim appeal outcome",
           algorithms: [
              { algorithm: "dt",  parms: [ { parm: "depth", parm_value: "5" } ] },
              { algorithm: "rf",  parms: [ { parm: "depth", parm_value: "5"},{ parm: "trees", parm_value: "7" } ] },
              { algorithm: "gbt", parms: [ { parm: "depth", parm_value: "5" } ] },
              { algorithm: "lr",  parms: [ { parm: "iterations", parm_value: "5" } ] },                            
              { algorithm: "svm", parms: [ { parm: "iterations", parm_value: "1000" },{ parm: "regularization", parm_value: "L2" } ] },                            
              { algorithm: "nb",  parms: [ { parm: "smoothing", parm_value: "1.0"},{ parm: "model_type", parm_value: "bernoulli" } ] },                            
              { algorithm: "nn",  parms: [ { parm: "network", parm_value: "1/50,2/100,3/50" } ] }                    
           ]
        }
      ],
      notes: []
    },
    { name: "workflow", description: "Workunit prioritization",  version: 1, model_class: "workflow", identifier: "claim_id",  current: true,
      features: [
         { name: "claim_amount", type: "double", label: "Claim Amount", parms: []},
         { name: "payee", type: "string", label: "Payee", parms: []},
         { name: "payers", type: "text", label: "Payers", parms: [ { encode: "mhc" }]},
         { name: "cpt_codes", type: "text", label: "CPT/HCPCS Codes", parms: [ { parm: "encode", parm_value: "mhc"}]},
         { name: "modifer_codes", type: "text", label: "CPT/HCPCS Modifier Codes", parms: [ { parm: "encode", parm_value: "mhc"}]},
         { name: "diagnosis_codes", type: "string", label: "Diagnosis (ICD-10) Codes", parms: [ { parm: "encode", parm_value: "mhc"}]},
         { name: "insurance_type", type: "string", label: "Insurance Type Code", parms: []},
         { name: "days_since_submitted", type: "integer", label: "Number of days since submitted", parms: []},
         { name: "facility_type", type: "string", label: "Place of service facility type", parms: []},
         { name: "location", type: "string", label: "City, state, and zip code", parms: [] }
      ],
      targets: [
         { name: "priority", type: "string", description: "Work unit priority",
           algorithms: [
              { algorithm: "dt",  parms: [ { parm: "depth", parm_value: "5" } ] },
              { algorithm: "rf",  parms: [ { parm: "depth", parm_value: "5"},{ parm: "trees", parm_value: "7" } ] },
              { algorithm: "gbt", parms: [ { parm: "depth", parm_value: "5" } ] },
              { algorithm: "lr",  parms: [ { parm: "iterations", parm_value: "5" } ] },                            
              { algorithm: "svm", parms: [ { parm: "iterations", parm_value: "1000" },{ parm: "regularization", parm_value: "L2" } ] },                            
              { algorithm: "nb",  parms: [ { parm: "smoothing", parm_value: "1.0"},{ parm: "model_type", parm_value: "bernoulli" } ] },                            
              { algorithm: "nn",  parms: [ { parm: "network", parm_value: "1/50,2/100,3/50" } ] }                    
           ]
        }
      ],
      notes: []
    },
    { name: "financial_performance", description: "Financial forecast",  version: 1, model_class: "financial", identifier: "claim_id",  current: true,
      features: [
         { name: "claim_amount", type: "double", label: "Claim Amount", parms: []},
         { name: "payee", type: "string", label: "Payee", parms: []},
         { name: "payers", type: "text", label: "Payers", parms: [ { encode: "mhc" }]},
         { name: "cpt_codes", type: "text", label: "CPT/HCPCS Codes", parms: [ { parm: "encode", parm_value: "mhc"}]},
         { name: "modifer_codes", type: "text", label: "CPT/HCPCS Modifier Codes", parms: [ { parm: "encode", parm_value: "mhc"}]},
         { name: "diagnosis_codes", type: "string", label: "Diagnosis (ICD-10) Codes", parms: [ { parm: "encode", parm_value: "mhc"}]},
         { name: "insurance_type", type: "string", label: "Insurance Type Code", parms: []},
         { name: "days_since_submitted", type: "integer", label: "Number of days since submitted", parms: []},
         { name: "facility_type", type: "string", label: "Place of service facility type", parms: []},
         { name: "location", type: "string", label: "City, state, and zip code", parms: [] }
      ],
      targets: [
         { name: "profitability", type: "string", description: "Profitability index",
           algorithms: [
              { algorithm: "dt",  parms: [ { parm: "depth", parm_value: "5" } ] },
              { algorithm: "rf",  parms: [ { parm: "depth", parm_value: "5"},{ parm: "trees", parm_value: "7" } ] },
              { algorithm: "gbt", parms: [ { parm: "depth", parm_value: "5" } ] },
              { algorithm: "lr",  parms: [ { parm: "iterations", parm_value: "5" } ] },                            
              { algorithm: "svm", parms: [ { parm: "iterations", parm_value: "1000" },{ parm: "regularization", parm_value: "L2" } ] },                            
              { algorithm: "nb",  parms: [ { parm: "smoothing", parm_value: "1.0"},{ parm: "model_type", parm_value: "bernoulli" } ] },                            
              { algorithm: "nn",  parms: [ { parm: "network", parm_value: "1/50,2/100,3/50" } ] }                    
           ]
        }
      ],
      notes: []
    }
];
db.model.drop();
db.createCollection('model')
db.model.insertMany(models)

var log_entries = [
   {
      entry_date: "2018-01-12-02:11:09.321",
      issuer:     "RPSERVER",
      severity:   "INFO",
      msg_class:  "USER",
      msg_action: "LOGIN",
      msg_entity: "mcovert",
      msg:        "User mcovert has logged in from 192.168.100.101",
      userid:     "mcovert"
   },
   {
      entry_date: "2018-01-12-08:45:12.101",
      issuer:     "RPSERVER",
      severity:   "INFO",
      msg_class:  "MODEL",
      msg_action: "CREATE",
      msg_entity: "claims.Claim Denials.1",
      msg:        "The model CLASS=claims;NAME=Claim Denials;VERSION=1 has been created",
      userid:     "mcovert"
   },
   {
      entry_date: "2018-01-12-08:52:53.622",
      issuer:     "RPSERVER",
      severity:   "INFO",
      msg_class:  "MODEL",
      msg_action: "CREATE",
      msg_entity: "claims.Claim Denials.2",
      msg:        "The model CLASS=claims;NAME=Claim Denials;VERSION=2 has been created",
      userid:     "mcovert"
   },
   {
      entry_date: "2018-01-12-09:02:02.041",
      issuer:     "RPSERVER",
      severity:   "INFO",
      msg_class:  "MODEL",
      msg_action: "CREATE",
      msg_entity: "claims.Claim Denials.3",
      msg:        "The model CLASS=claims;NAME=Claim Denials;VERSION=3 has been created",
      userid:     "mcovert"
   },
   {
      entry_date: "2018-01-12-09:02:07.060",
      issuer:     "RPSERVER",
      severity:   "INFO",
      msg_class:  "MODEL",
      msg_action: "SET-CURRENT",
      msg_entity: "claims.Claim Denials.3",
      msg:        "The model CLASS=claims;NAME=Claim Denials;VERSION=3 is now the current model",
      userid:     "mcovert"
   },
   {
      entry_date: "2018-01-31-11:11:01.020",
      issuer:     "RPSERVER",
      severity:   "INFO",
      msg_class:  "USER",
      msg_action: "LOGIN",
      msg_entity: "mcovert",
      msg:        "User mcovert has logged in from 192.168.100.101",
      userid:     "mcovert"
   },
   {
      entry_date: "2018-01-31-11:12:32.055",
      issuer:     "RPSERVER",
      severity:   "INFO",
      msg_class:  "MODEL",
      msg_action: "CREATE",
      msg_entity: "claims.Claim Denials.4",
      msg:        "The model CLASS=claims;NAME=Claim Denials;VERSION=4 has been created",
      userid:     "mcovert"
   },
   {
      entry_date: "2018-01-12-09:16:02.001",
      issuer:     "RPJOBSERVER",
      severity:   "INFO",
      msg_class:  "JOB",
      msg_action: "TRAIN",
      msg_entity: "QDX_TRAINING_JOB",
      msg:        "STATUS=COMPLETE;MODEL=claims.Claim Denials.4;ACCURACY=0.72;IN=claims.quadax.training.20180101,RECS=2071921",
      userid:     "mcovert"
   },
   {
      entry_date: "2018-01-31-13:12:21.002",
      issuer:     "RPSERVER",
      severity:   "INFO",
      msg_class:  "MODEL",
      msg_action: "SET-CURRENT",
      msg_entity: "claims.Claim Denials.4",
      msg:        "The model CLASS=claims;NAME=Claim Denials;VERSION=4 is now the current model",
      userid:     "mcovert"
   },
   {
      entry_date: "2018-01-31-11:00:00.001",
      issuer:     "RPJOBSERVER",
      severity:   "INFO",
      msg_class:  "JOB",
      msg_action: "PREDICT",
      msg_entity: "QDX_PREDICT_JOB",
      msg:        "STATUS=COMPLETE;MODEL=claims.Claim Denials.4;IN=claims.quadax.prod.20180130,RECS=15021",
      userid:     "mcovert"
   },
   {
      entry_date: "2018-02-01-11:00:00.003",
      issuer:     "RPJOBSERVER",
      severity:   "INFO",
      msg_class:  "JOB",
      msg_action: "PREDICT",
      msg_entity: "QDX_PREDICT_JOB",
      msg:        "STATUS=COMPLETE;MODEL=claims.Claim Denials.4;IN=claims.quadax.prod.20180131,RECS=12176",
      userid:     "mcovert"
   },
   {
      entry_date: "2018-02-02-11:00:00.017",
      issuer:     "RPJOBSERVER",
      severity:   "INFO",
      msg_class:  "JOB",
      msg_action: "PREDICT",
      msg_entity: "QDX_PREDICT_JOB",
      msg:        "STATUS=COMPLETE;MODEL=claims.Claim Denials.4;IN=claims.quadax.prod.20180201,RECS=18055",
      userid:     "mcovert"
   }
]
db.log.drop();
db.createCollection('log')
db.log.insertMany(log_entries)

var batches = [
   {
      batch_id    : '20180119_0003235',
      file_name   : 'complete/batch_20180124_0003235.gpg',
      create_date : '20180119',
      batch_type  : 'predict',
      status      : 'ready',
      size        : 2046000
   },
   {
      batch_id    : '20180131_0604141',
      file_name   : 'ready/batch_20180131_0604141.gpg',
      create_date : '20180120',
      batch_type  : 'predict',
      status      : 'ready',
      size        : 2256000
   },
   {
      batch_id    : '20180202_1039965',
      file_name   : 'ready/train_20180202_1039965.gpg',
      create_date : '20180119',
      batch_type  : 'predict',
      status      : 'ready',
      size        : 121046000
   }
];
db.batch.drop();
db.createCollection('batch');
db.batch.insertMany(batches);

var datamaps = [
   {
      datamap_name  : 'claim_train',
      datamap_type  : 'field_map',
      fields        : [
                         {
                         	field_name: 'claim_status',
                         	field_type: 'string'
                         },
                         {
                         	field_name: 'claim_amt',
                         	field_type: 'double'
                         },
                         {
                         	field_name: 'payer',
                         	field_type: 'text'
                         },
                         {
                         	field_name: 'diag_codes',
                         	field_type: 'text'
                         },
                         {
                         	field_name: 'cpt_codes',
                         	field_type: 'text'
                         }
                      ],
      xlate         : []
   },
   {
      datamap_name  : 'claim_predict',
      datamap_type  : 'field_map',
      fields        : [
                         {
                         	field_name: 'claim_amt',
                         	field_type: 'double'
                         },
                         {
                         	field_name: 'payer',
                         	field_type: 'text'
                         },
                         {
                         	field_name: 'diag_codes',
                         	field_type: 'text'
                         },
                         {
                         	field_name: 'cpt_codes',
                         	field_type: 'text'
                         }
                      ],
      xlate         : []
   },
   {
      datamap_name  : 'qdx_to_claim',
      datamap_type  : 'xlate',
      fields        : [
                         {
                         	field_name: 'claim_amount',
                         	field_type: 'double'
                         }
                      ],
      xlate         : [
                         {
                         	field_name: 'claim_amt',
                         	field_type: 'double'
                         }
                      ]
   },
];
db.datamap.drop();
db.createCollection('datamap');
db.datamap.insertMany(datamaps);

var datafiles = [
  { 
      file_name : 'claims_20180125.csv',
      file_type : 'predict',
      size      : 2222000,
      records   : 10123,
      datamap_name : 'claim_predict',
      batch_id  : '20180131_0604141'
  },
  { 
      file_name : 'claims_20180127.csv',
      file_type : 'predict',
      size      : 1993000,
      records   : 9867,
      datamap_name : 'claim_predict',
      batch_id  : '20180131_0604141'
  },
  { 
      file_name : 'claims_20180129.csv',
      file_type : 'predict',
      size      : 2267000,
      records   : 11354,
      datamap_name : 'claim_predict',
      batch_id  : '20180131_0604141'
  }
];
db.datafile.drop();
db.createCollection('datafile');
db.datafile.insertMany(datafiles);

var trained_models = [
   {   model_class: "claim",
       model_name: "claim_denial",
       model_version: 1,
       target_name: "status",
       alg_name: "dt",
       alg_type: "decision_tree",
       job_name: "rp_train_20180201103207",
       run_date: "20180201103207",
       records_train: 4040,        
       records_test: 1010,
       results: [
           {
               result_type:  "decision_tree",
               result_value: `{ 
                    depth: 5,
                    num_categories: 3,
                    categories: ["PAID", "DENIED", "PARTIAL"],
                    tree: {
                      left: {
                         expr: "amt<10000",
                         left: {
                           expr: "payer=AETNA",
                           result: "PAID"
                         },
                         right: {
                           expr: "payer=UHC",
                           result: "PAID"
                         }
                      },
                      right: {
                         expr: "amt>=10000",
                         left: {
                           expr: "payer=AETNA",
                           result: "PAID"
                         },
                         right: {
                           expr: "payer=UHC",
                           result: "DENIED"
                         }
                      }
                    }
               }`
           },
           {
               result_type: "accuracy",
               result_value: '0.84'
           },
           {
               result_type: "confusion",
               result_value: `[  200,   20,  10,
                           10,  600,  40,
                           10,   20, 100
                      ]`
           }
       ]
   }
];
db.trainedmodel.drop();
db.createCollection('trainedmodel');
db.trainedmodel.insertMany(trained_models);

var jobs = [
    { job_name: "rp_train",
      job_class: "train",
      job_version: 1,
      create_date: "20170112",
      created_by: "mcovert",
      parms: [
           {
              parm: "model_name",
              parm_value: "model_class.model_name.model_version"
           },
           {
              parm: "sql",
              parm_value: "select * from input"
           },
           {
              parm: "split_pct",
              parm_value: "0.8"
           }
      ],
      description: "Model training job",
      job_type: "spark"
    },
    { job_name: "rp_predict",
      job_class: "predict",
      job_version: 1,
      create_date: "20170112",
      created_by: "mcovert",
      parms: [
           {
              parm: "model_name",
              parm_value: "model_class.model_name.model_version"
           },
           {
              parm: "sql",
              parm_value: "select * from input"
           },
           {
              parm: "data_map",
              parm_value: "data_map_name"
           }
      ],
      description: "Model prediction job",
      job_type: "spark"
    }
];
db.job.drop();
db.createCollection('job');
db.job.insertMany(jobs);

var job_execs = [
    { job_id: "rp_train_20180201093412",
      job_class: "train",
      job_version: 1,
      create_date: "20170112",
      created_by: "mcovert",
      parms: [
           {
              parm: "model_name",
              parm_value: "claim.claim_denial.1"
           },
           {
              parm: "sql",
              parm_value: "select * from claim_training"
           },
           {
              parm: "split_pct",
              parm_value: "0.8"
           }
      ],
      description: "Model training job",
      job_type: "spark"
    },
    { job_name: "rp_predict",
      job_class: "predict",
      job_version: 1,
      create_date: "20170112",
      created_by: "mcovert",
      parms: [
           {
              parm: "model_name",
              parm_value: "claim.claim_denial.1"
           },
           {
              parm: "sql",
              parm_value: "select * from claim_predict"
           },
           {
              parm: "data_map",
              parm_value: "qdx_claim"
           }
      ],
      description: "Model prediction job",
      job_type: "spark"
    }
];
db.jobexec.drop();
db.createCollection('jobexec');
db.jobexec.insertMany(job_execs);

