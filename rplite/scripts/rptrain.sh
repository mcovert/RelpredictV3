#!/bin/bash
#
#   bin/rptrain.sh "application-parms" "system-parms"
#
# Source the application environment
. bin/relpredict-env.sh
# Set up system parameters if not specified
bin/rp_run.py $@ --env yarn --run_type train
