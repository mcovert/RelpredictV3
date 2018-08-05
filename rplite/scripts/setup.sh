#!/bin/bash
echo "Setting up RelPredict groups and rpadmin user."
# rpuser group can run jobs that use models
groupadd rpuser
# rpmodeler group can create, train, and promote models
groupadd rpmodeler
# rpadmin is the superuser 
groupadd rpadmin
useradd -g rpadmin   rpadmin
usermod -G rpuser    rpadmin
usermod -G rpmodeler rpadmin
#
echo "Setting up RelPredict HDFS directories."
hdfs dfs -mkdir /relpredict
hdfs dfs -mkdir /relpredict/models
hdfs dfs -copyFromLocal ../conf/* /relpredict/conf 
hdfs dfs -mkdir /relpredict/logs
hdfs dfs -mkdir /relpredict/data
hdfs dfs -mkdir /relpredict/conf
#
hdfs dfs -chown -R rpadmin:rpadmin /relpredict
hdfs dfs -chmod -R 770 /relpredict
#
hdfs dfs -chgrp rpmodeler /relpredict/conf
hdfs dfs -chgrp rpmodeler /relpredict/models
#
hdfs dfs -chgrp rpuser /relpredict/logs
hdfs dfs -chgrp rpuser /relpredict/data
echo "RelPredict setup is complete."