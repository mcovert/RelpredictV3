#!/bin/bash
. relpredict-env.sh
#   Parm       Value                                        Options
# --run_type   train                                        
# --jobname    claim_status                                 
# --split      0.8                                          0.1 <= split <= 0.9
# --model_def  conf/claim_model                             
# --sql        "select * from claims.claims limit 10000"    
# --verbose    true                                         true | false
# --env        yarn                                         yarn | local
# --debug      true                                         true | false
# --base_dir   RelPredict
#
# --column_map conf/column_map.csv                          *optional
# --data_maps  "map=file;map=file..."                       *optional
# --parms      "parm=value;parm=value..."                   *optional                                   
#
/opt/spark/bin/spark-submit --class com.ai.relpredict.jobs.RelPredict --master yarn --deploy-mode client --executor-memory 22G --num-executors 10 lib/relpredict.jar --run_type train --jobname claim_status --split 0.8 --model_def conf/claim_model --sql "select * from claims.claims limit 10000" --verbose true --env yarn --debug true --base_dir RelPredict

#   Parm      Value                                        Options
# --run_type  predict                                      (train | predict)
# --jobname   claim_status                                 
# --model_id  20170322130414000                            identifier or not specified (= current model)
# --model_def conf/claim_model                             
# --sql       "select * from claims.claims limit 10000"    
# --verbose   true                                         true | false
# --env       yarn                                         yarn | local
# --debug     true                                         true | false
# --base_dir  RelPredict                                   (if not absolute, relative to /user/userid in HDFS) 
#
# --save_as   hdfs                                         hdfs
# --output    rpout                                        output directory (if not absolute, relative to /user/userid in HDFS)                                  
#           -- or --
# --save_as   hive                                         hive
# --output    result_table                                 hive table name                                  
#
# --column_map conf/column_map.csv                         *optional
# --data_maps  "map=file;map=file..."                      *optional
# --parms      "parm=value;parm=value..."                  *optional                                   
#
/opt/spark/bin/spark-submit --class com.ai.relpredict.jobs.RelPredict --master yarn --deploy-mode client --executor-memory 22G --num-executors 10 lib/relpredict.jar --run_type predict --jobname claim_status --model_def conf/claim_model --sql "select * from claims.claims limit 10000" --verbose true --env yarn --debug true --base_dir RelPredict --save_as hdfs --output rpout

/opt/spark/bin/spark-submit --class com.ai.relpredict.jobs.RelPredict --master yarn --deploy-mode client --executor-memory 22G --num-executors 10 lib/relpredict.jar --run_type predict --jobname claim_status --model_def conf/claim_model --sql "select * from claims.claims limit 10000" --verbose true --env yarn --debug true --base_dir RelPredict --save_as hive --output result_table
