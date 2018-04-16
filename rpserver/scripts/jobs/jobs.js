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

