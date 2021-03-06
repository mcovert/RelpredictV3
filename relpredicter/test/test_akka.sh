#!/bin/bash

echo -e '#!/bin/bash\n for v in {1..100}; do; curl "http://ai26:8080/tables?source=hive&schema=relpredict"; done' > c1.sh
chmod +x c1.sh
echo -e '#!/bin/bash\n for v in {1..100}; do; curl "http://ai26:8080/tables?source=hive&schema=default"; done' > c2.sh
chmod +x c2.sh
echo -e '#!/bin/bash\n for v in {1..100}; do; curl "http://ai26:8080/tables?source=hive&schema=mm_staging"; done' > c5.sh
chmod +x c5.sh
echo -e '#!/bin/bash\n for v in {1..100}; do; curl "http://ai26:8080/query?source=hive&schema=relpredict&table=claim_status&limit=20"; done' > c4.sh
chmod +x c4.sh
echo -e '#!/bin/bash\n for v in {1..100}; do; curl "http://ai26:8080/query?source=hive&schema=relpredict&table=claim_status&limit=1"; done' > c3.sh
chmod +x c3.sh
echo -e '#!/bin/bash\n for v in {1..100}; do; curl "http://ai26:8080/query?source=hive&schema=relpredict&table=rp_results&limit=50"; done' > c6.sh
chmod +x c6.sh

gnome-terminal -x ./c1.sh &
gnome-terminal -x ./c2.sh &
gnome-terminal -x ./c3.sh &
gnome-terminal -x ./c4.sh &
gnome-terminal -x ./c5.sh &
gnome-terminal -x ./c6.sh &
