#!/bin/bash
 for v in {1..100}; do; curl "http://ai26:8080/query?source=hive&schema=relpredict&table=rp_results&limit=50"; done
