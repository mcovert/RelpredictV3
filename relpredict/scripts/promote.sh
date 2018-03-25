#!/bin/bash
#
#  Promote a RelPredict model to make it current. It will be used as the default trained model for prediction jobs. This command also
#  saves the current default into a "last" folder. Note that only a single "last" is saved so that no other prior history is kept.  
#
#  promote.sh model_def model_version run_id 
#
. relpredict-env.sh
if [ "$#" -ne 3 ]; then
    echo "Wrong number of arguments"
    echo "promote.sh model_name model_version run_id"
    exit -1
fi
export model_name=$1
export model_ver=$2
export run_id=$3
echo "Saving current version to last"
hdfs dfs -rm -R $RELPREDICT_HDFS_HOME/models/$model_name/$model_ver/last/*
hdfs dfs -cp $RELPREDICT_HDFS_HOME/models/$model_name/$model_ver/current/* $RELPREDICT_HDFS_HOME/data/$model_name/$model_ver/last
echo "Promoting $run_id to current for $model_name version $model_ver"
hdfs dfs -cp $RELPREDICT_HDFS_HOME/models/$model_name/$model_ver/$run_id/* $RELPREDICT_HDFS_HOME/models/$model_name/$model_ver/current
echo $run_id | hdfs dfs -put $RELPREDICT_HDFS_HOME/models/$model_name/$model_ver/current/version
echo "Done."