#!/bin/bash
#
# Set up a RelPredict account. This requires that the rpadmin user has been defined and that the base directory has been built and
# assigned the appropriate ownership.
#
if [ -z "$1"]; then
	echo "Usage: setup.sh account-name"
	echo "No account name was specified"
	exit -1
fi
if [ "$(whoami)" != "rpadmin"]; then
	echo "This script must be run as user rpadmin"
	exit -1
fi
export BASEDIR=/home/relpredict/accounts/$1
mkdir -p $BASEDIR/dataservice/batches
mkdir -p $BASEDIR/dataservice/datafiles
mkdir -p $BASEDIR/jobservice/templates