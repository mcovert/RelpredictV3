#!/bin/bash
#
#  Restore the prior RelPredict model to make it current. Note that this can only be done once since no prior history is kept.  
#
#  promote.sh base_dir model_def model_version 
#
. relpredict-env.sh
if [ "$#" -ne 2 ]; then
    echo "Wrong number of arguments"
    echo "promote.sh model_name model_version run_id"
    exit -1
fi
export model_name=$1
export model_ver=$2
hdfs dfs -rm -R $RELPREDICT_HDFS_HOME/models/$model_name/$model_ver/current/*
hdfs dfs -cp $RELPREDICT_HDFS_HOME/models/$model_name/$model_ver/last/* $RELPREDICT_HDFS_HOME/data/$model_name/$model_ver/current
echo "Done."