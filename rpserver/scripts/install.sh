#!/bin/bash
#
# Set up the base RelPredict system. This must be run as root.
#
if [ "$(whoami)" != "root"]; then
	echo "This script must be run as root"
	exit -1
fi
useradd rpadmin
mkdir -p /home/relpredict/lib
mkdir -p /home/relpredict/conf
mkdir -p /home/relpredict/bin
chown rpadmin:rpadmin /home/relpredict
su hdfs 
hdfs dfs -mkdir /relpredict
echo "Done."