#!/usr/bin/python
import sys
import os
import datetime

cmdargs = ""
app_parms = { }
sys_parms = { "--num-executors"   : "4", 
              "--executor-memory" : "8G" 
}
runtype = "train"
i = 1
while (i < len(sys.argv)):
#  print "arg[" + `i` + "] = " + sys.argv[i]
   if (sys.argv[i].startswith("--")):
      if (sys_parms.has_key(sys.argv[i])):
         sys_parms[sys.argv[i]] = sys.argv[i + 1]
         i = i + 2
      else:
         if (sys.argv[i] == "--model_def"):
             model_def = sys.argv[i + 1]
         else:
             app_parms[sys.argv[i]] = sys.argv[i+1]
             if (sys.argv[i] == "--run_type"):
                 runtype = sys.argv[i + 1]
         i = i + 2
   else:
      print "Unknown command line parameter is ignored: " + sys.argv[i]
      i = i + 1

for key in sys_parms.keys():
       cmdargs = cmdargs + key + " " + sys_parms[key] + " "

cmdargs = cmdargs + " " + os.environ['RP_JARFILE'] + " "

jobdir  = os.environ["RP_JOBDIR"] + "/" + runtype + "_" + datetime.datetime.now().strftime("%Y%m%d%H%M%S")
app_parms["--model_def"] = jobdir + "/model"

for key in app_parms.keys():
       cmdargs = cmdargs + " " + key + " " + app_parms[key] + " "

cmdargs = cmdargs + " --job_dir " + jobdir

print "Setting up job log directory: \n   " + jobdir
os.system("mkdir " + jobdir)

print "Setting up HDFS job directory: \n   " + jobdir
os.system("hdfs dfs -mkdir " + jobdir)

print "Copying model " + os.environ['RP_MODELDIR'] + '/' + model_def + " to HDFS: \n   " + jobdir + "/model" 
os.system("hdfs dfs -copyFromLocal " + os.environ['RP_MODELDIR'] + "/" + model_def + " " + jobdir + "/model")

print "Copying model " + os.environ['RP_MODELDIR'] + '/' + model_def + " to local: \n   " + jobdir + "/model" 
os.system("cp " + os.environ['RP_MODELDIR'] + "/" + model_def + " " + jobdir + "/model")

cmd = os.environ['SPARK_HOME'] + "/bin/spark-submit --class com.ai.relpredict.jobs.RelPredict --master yarn --deploy-mode client --files /relpredict/conf/log4j.properties " + cmdargs + " > " + jobdir + "/log" 

print "Executing command: \n   " + cmd
os.system(cmd)     

print "Copying job directory back to local and cleaning up." 
os.system("hdfs dfs -copyToLocal " +  jobdir + "/results " + jobdir + "/results");
os.system("hdfs dfs -rm -r " + jobdir);
   
  

