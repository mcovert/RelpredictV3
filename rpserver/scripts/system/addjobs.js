var jobs = [
    { job_name: "rp_text",
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
              parm: "predict_column",
              parm_value: "msg_class"
           },
           {
              parm: "train_column",
              parm_value: "msg"
           },           {
              parm: "split_pct",
              parm_value: "0.8"
           },
           {
              parm: "sql",
              parm_value: "select * from input"
           }
      ],
      description: "Model training job for text classification",
      job_type: "java"
    }
];
db.job.insertMany(jobs);