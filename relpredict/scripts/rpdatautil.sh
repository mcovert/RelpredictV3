#!/bin/bash
if [ "$#" -eq 0 ]; then
   echo "Move and optionally upzip/untar data files"
   echo "Usage: rpdatautil.sh file1 file2 ..."
   exit -1
fi
. ./relpredict-env.sh
DATESTR=$(date +%Y-%m-%d)
for FILE in $@; do
   EXTENSION=${FILE#*.}
   BASENAME=`basename $FILE .$EXTENSION`
   echo "Processing " $RP_UPLOADDIR/$FILE
   cd $RP_DATAFILEDIR
   if [ "$EXTENSION" == "zip" ]; then
      echo "Unzipping to data directory..."
      mkdir $BASENAME-$DATESTR
      cd $BASENAME-$DATESTR
      unzip $RP_UPLOADDIR/$FILE
      mv $RP_UPLOADDIR/$FILE $RP_ARCHIVEDIR/$FILE 
   elif [ "$EXTENSION" == "tgz" ] || [ "$EXTENSION" == "tar.gz" ]; then
      echo "Tar extraction to data directory..."
      mkdir $BASENAME-$DATESTR
      cd $BASENAME-$DATESTR
      tar zxvf $RP_UPLOADDIR/$FILE
      mv $RP_UPLOADDIR/$FILE $RP_ARCHIVEDIR/$FILE 
   elif [ "$EXTENSION" == "datamap" ] || [ "$EXTENSION" == "xlate" ]; then
      echo "Moving to maps directory..."
      cp $RP_UPLOADDIR/$FILE $RP_ARCHIVEDIR/$FILE 
      mv $RP_UPLOADDIR/$FILE $RP_DATAMAPDIR/$FILE
   else
      echo "Moving to datafile directory..."
      cp $RP_UPLOADDIR/$FILE $RP_ARCHIVEDIR/$FILE 
      mv $RP_UPLOADDIR/$FILE $RP_DATAFILEDIR/$FILE
   fi
done   
