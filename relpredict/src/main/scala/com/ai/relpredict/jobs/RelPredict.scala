package com.ai.relpredict.jobs

import scala.util.parsing._
import scala.util.parsing.combinator._
import com.ai.relpredict.dsl._
import java.io.FileReader
import java.io.Reader
import com.ai.relpredict.util._
import org.apache.log4j.{Level, LogManager, PropertyConfigurator}
import com.ai.relpredict.spark._
import org.apache.spark.sql.SparkSession
import scala.collection.mutable.ListBuffer
import scala.collection.mutable.ArrayBuffer

/**
*  The RelPredict job
*
*{{{
* Command line formats:
*     relpredict config_file
*                Use the config file to load the configuration
*
*     relpredict --run_type train  --split 0.8  
*
*     relpredict --run_type predict --model_def saved_model.model --save_as format --job_dir location --run_id runID
*     
*                For predicted records, save_as format is hive or hdfs (the default is hive), and output location, for hive is the 
*                output table name (must be of the proper format for predicted records), and for hdfs is the root directory                                    
*                A predicted record format is:
*                      model_class     - model_class (string)
*                      model           - model name (string)
*                      version         - model version (int)
*                      target          - name of predicted target (string)
*                      algorithm       - name of the alogorithm used (string)
*                      id              - record identifier (string)
*                      predicted       - predicted value (double)
*                      predicted_value - translated predicted value (string)
*                      probability     - probability that the prediction is correct (0.0 to 1.0, double)
* *
*  Both formats must specify:
*        --sql        "select * from training"
*        --model_def  model_def_file  (model_class/moel_name/model_version)
*        --table      "database.table_name"
*        --limit      record_limit 
*        
*  Either format can specify:
*        --column_map column_map_filename
*          A column map can be used to rename columns from the input data frame to feature names
*        --data_map   map_name=map_file_name;map_name=map_file_name;...
*          A data map can be sepcified with the name of a feature or target translate values. Note: only translating String (or Text) types is allowed.
*        --jobname    "job name" (default is relpredict)
*          The job name will be used by Spark
*        --env        [local | yarn-client | yarn-cluster] (default is yarn-cluster)
*          The run time environment specifies the mode that Spark will use
*        --parms      "parm=val;parm=val; ... "
*          Parameters that are passed to the job. They can be used symbolically in the model definition file
*        --verbose    [true | false] (default is false)
*          Log output level
*}}}        
*/
object RelPredict extends GrammarDef {
    val sysName = "RelPredict"
    private var dataMaps                            = Map[String, Datamap]()
    private var sparkSession : Option[SparkSession] = None
    private var baseResults      : Results          = new Results()                        
    private var jobResults       : Results          = new Results()                        
    private var modelResults     : Results          = new Results()                        
    private var dataResults      : Results          = new Results()                        

    def main(args: Array[String]) {
      ScalaUtil.start(sysName, args)            // Initialize system tracking and logging facilities
      ScalaUtil.setShutdownHook(this.shutdown)  // Register the system shutdown hook
      baseResults.put("job",   jobResults)
      baseResults.put("model", modelResults)
      baseResults.put("data",  dataResults)
      val cmdLine = new StringBuilder()
      args.foreach(arg => cmdLine.append(s"$arg "))
      ScalaUtil.controlMsg("Command line: " + cmdLine.toString);
      jobResults.put("cmdline", cmdLine.toString)
      // Set up RelPredict configuration. See RPConfig for details.
      var config : Option[Config] = RPConfig.getConfig(args)
      config match {
          case Some(config) => {
             RPConfig.setBaseDir(config.base_dir)
             RPConfig.setJobDir(config.job_dir)
             ScalaUtil.setEnvironment(config.env)
             ScalaUtil.controlMsg("Building job...")
             val job = getJob(config)
             if (config.run == "false") {
                    ScalaUtil.controlMsg("Run was set to false. The job will not be submitted.")
             }
             else {
                job match {
                  // If Job was built successfully, set it up and run it. 
                  case Some(j) => {
                    ScalaUtil.controlMsg(s"Running job ${j.jobname}")
                    j.setup(baseResults)
                    j.run()
                    j.cleanup()
                    val jsonResults = JsonConverter.toJson(baseResults)
                    /* Save results  to file */
                    val dir = RPConfig.getJobDir()
                    SparkUtil.saveTextToHDFSFile(jsonResults, s"${dir}results", sparkSession.get)
                    ScalaUtil.controlMsg(s"Job ${j.jobname} completed with return code ${jobResults.getRC()}")
                  }
                  // Else write and error message and end
                  case None => ScalaUtil.terminal_error("Job could not be created")
                }
             }
          }
          // If there is no config information, print error and end
          case None => ScalaUtil.terminal_error("Error loading configuration information")
      }
      ScalaUtil.end(sysName)
    }
    def getModelFileName(conf: Config) : String = {
      val cnv = conf.model_def.split("/");
      return conf.base_dir + "/models/" + conf.model_def + "/" + cnv(1) + ".modeldef"
    }
    // def loadConfig(configFile: String) : Array[String] = {
    //   val source = scala.io.Source.fromFile(configFile)
    //   val parms = source.getLines.map(l => {
    //     val kv = l.split("=")
    //     List("--" + kv(0), kv(1))
    //   }).flatMap(x => x).toArray
    //   parms
    // }
    // Generate a Job from command line parameters. 
    def getJob(conf : Config) : Option[Job] = {
      val jobParms = ScalaUtil.makeParms(conf.parms)
      val p = if (jobParms.size == 0) "*none*" else jobParms.mkString(",")
      ScalaUtil.controlMsg(s"Job name: ${conf.jobname} Parameters: $p")      
      val columnMap = getColumnMap(conf.column_map)
      // Load any data maps into the global cache
      loadDataMap(conf.data_maps)
      val modelFileName = getModelFileName(conf)
      val modelDef = getModelDef(modelFileName)
      if (modelDef.isEmpty) ScalaUtil.terminal_error(s"Model definition file ${modelFileName} was not specified")
      if (ScalaUtil.verbose) modelDef.get.print()
      // Create the SparkSession
      if (conf.run != "true") return None
      val ss = SparkUtil.buildSparkSession(conf.jobname, conf.env)
      sparkSession = Some(ss)
      ScalaUtil.controlMsg(s"SparkSession creation was successful")
      // Create input data frame
      import ss.implicits._
      import ss.sqlContext.implicits._
      val df = ss.sqlContext.sql(conf.sql)
      df.cache
      ScalaUtil.controlMsg(s"SQL statement is ${conf.sql}")
      val model = new com.ai.relpredict.spark.Model(modelDef.get, ss, df, columnMap)
      // Check the run type and generate the appropriate job type
      conf.run_type match {
          case "train" => {
            ScalaUtil.controlMsg("Training job created")            
            Some(TrainingJob(conf.jobname, model, conf, ss, df, columnMap, jobParms))
          }
          case "predict" => {
            ScalaUtil.controlMsg("Prediction job created")            
            Some(PredictionJob(conf.jobname, model, conf, ss, df, columnMap, jobParms))
          }
          case unknown => { ScalaUtil.terminal_error(s"Unknown run type: $unknown"); None }
      }
    }
    // Load the model definition file
    def getModelDef(fileName : String) : Option[ModelDef] = {
      ScalaUtil.controlMsg(s"Loading model definition from $fileName")
      val testModel : Reader = {
        if (ScalaUtil.isLocalMode()) {
          ScalaUtil.controlMsg(s">>> Loading from local storage")
          new FileReader(fileName)
        }
        else {
          ScalaUtil.controlMsg(s">>> Loading from HDFS")
          SparkUtil.getHDFSFileReader(fileName).get
        }
      }
      val r = parse(modelDef,testModel)
      r match {
           case Success(matched,_) => {
               matched match {
                  case (m : ModelDef) => {
                       return Option(m)
                  }
               }
           } 
           case Failure(msg,_) => { 
             ScalaUtil.terminal_error(s"Loading the model file $fileName failed with error $msg")
           }
           case Error(msg,_) => { 
             ScalaUtil.terminal_error(s"Loading the model file $fileName failed with error $msg")
           }
      }
      None
    }
    // Load the data map if it was specified
    def getColumnMap(fileName : String) : Datamap = {
      fileName match {
        case "" => {
          ScalaUtil.controlMsg(s"No column map was specified")
          new Datamap("")
        }
        case x => {
          ScalaUtil.controlMsg(s"Loading column map from $fileName")        
          Datamap(x)
        }
      }
    }
    def loadDataMap(mapDefs : String) {
      if (mapDefs.isEmpty) { ScalaUtil.controlMsg("No data maps were specified"); return}
      val dMapDefs = mapDefs.split(";")
      dataMaps = dMapDefs.map(md => {
        val mapEntry = md.split("=")
        if (mapEntry.length != 2) ScalaUtil.terminal_error(s"Data map definition statement $md has a syntax error. Please correct it and rerun")
        else ScalaUtil.controlMsg(s"Loading data map ${mapEntry(0)} from ${mapEntry(1)}")        
        (mapEntry(0).toLowerCase() -> Datamap(mapEntry(1)))
      }).toMap
    }
    def getDataMap(name : String) : Option[Datamap] = dataMaps.get(name.toLowerCase()) 
    // Perform any shutdown activities that may be required
    def shutdown() {
      ScalaUtil.controlMsg("Shutdown hook entered.")
      sparkSession match {
        case None =>
        case Some(s) => {
          ScalaUtil.controlMsg("Stopping the Spark Context.")
          s.sparkContext.stop()
        }
      }
      ScalaUtil.controlMsg("Shutdown hook complete.")
    }
}