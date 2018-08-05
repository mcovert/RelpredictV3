#!/bin/bash
export JAVA_HOME=/usr/java/jdk1.7.0_67-cloudera
export SPARK_HOME=/opt/spark
export HADOOP_CONF_DIR=/etc/hadoop/conf.cloudera.yarn
/opt/spark/bin/spark-submit --class com.ai.relpredict.jobs.RelPredict --master yarn --deploy-mode client --files conf/log4j.properties --executor-memory 22G --num-executors 10 lib/relpredict.jar --run_type predict --jobname claim_status --model_def RelPredict/conf/claim_model --sql "select * from claims.claims limit 20000" --verbose true --env yarn 
