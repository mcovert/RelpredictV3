#!/bin/bash
 for v in {1..100}; do; curl "http://ai26:8080/tables?source=hive&schema=mm_staging"; done
