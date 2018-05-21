#!/bin/bash
export RELPREDICT_HOME=/relpredict
export RP_SCRIPTS=$RELPREDICT_HOME/bin
export RP_UPLOADDIR=$RELPREDICT_HOME/data/uploads
export RP_ARCHIVEDIR=$RELPREDICT_HOME/data/archive
export RP_DATAFILEDIR=$RELPREDICT_HOME/data/datafiles
export RP_DATAMAPDIR=$RELPREDICT_HOME/data/datafiles/datamaps
export RP_JOBDIR=$RELPREDICT_HOME/jobs
export RP_LOGDIR=$RP_JOBDIR/logs
export RP_JOBTEMPLATEDIR=$RELPREDICT_HOME/jobs/templates
export RP_MODELDIR=$RELPREDICT_HOME/models
export RP_JOBSERVERS="ai24,ai26,ai27"
export JAVA_HOME=/usr/java/jdk1.7.0_67-cloudera
export SPARK_HOME=/opt/spark
export HADOOP_CONF_DIR=/etc/hadoop/conf.cloudera.yarn
export RP_JARFILE=$RELPREDICT_HOME/lib/relpredict_2.11-0.1-SNAPSHOT.jar

function getModel()
{
    take_next=false
    for v in "$@"
    do
       if $take_next; then return "$v"; fi
       if ["$v" -eq "--model_def"]; then take_next=true; fi
    done
    return ""
}
