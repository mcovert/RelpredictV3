#!/bin/bash
#
# Set up a RelPredict environment variables.
#
if [ -z "$1"]; then
	echo "Usage: relpredict-env.sh account-name"
	echo "No account name was specified"
	exit -1
fi
if [ "$(whoami)" != "rpadmin"]; then
	echo "This script must be run as user rpadmin"
	exit -1
fi
export BASEDIR=/home/relpredict/accounts/$1
export HDFSDIR=/user/relpredict/accounts/$1
export RP_ACCOUNT=$1