package com.ai.relpredict.jobs

import scopt._

/* Define the command line parameter configuration class */
case class Config(jobname:       String = "relpredict", 
                  sql:           String = "select * from training",
                  data_def:      String = "data.datadef",
                  split:         Double = 0.8,
                  base_dir:      String = "RelPredict",
                  run_type:      String = "train", 
                  env:           String = "yarn-cluster", 
                  model_def:     String = "model.modeldef",
                  run_id:        String = "current",
                  data_maps:     String = "",
                  column_map:    String = "",
                  verbose:       String = "false",
                  debug:         String = "false",
                  parms:         String = "",
                  run:           String = "true")

