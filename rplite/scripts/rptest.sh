#!/bin/bash
export JAVA_HOME=/usr/java/jdk1.7.0_67-cloudera
export SPARK_HOME=/opt/spark
export HADOOP_CONF_DIR=/etc/hadoop/conf.cloudera.yarn
echo "/opt/spark/bin/spark-submit --class com.ai.relpredict.jobs.RelPredict --master yarn --deploy-mode client --files conf/log4j.properties --executor-memory 22G lib/relpredict.jar --env yarn $@"
/opt/spark/bin/spark-submit --class com.ai.relpredict.jobs.RelPredict --master yarn --deploy-mode client --files conf/log4j.properties --executor-memory 22G lib/relpredict.jar --env yarn $@ 
