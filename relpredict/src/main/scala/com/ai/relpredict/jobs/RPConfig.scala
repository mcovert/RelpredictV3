package com.ai.relpredict.jobs

import com.ai.relpredict.util.ScalaUtil
import com.ai.relpredict.spark._
import scala.collection.JavaConverters._

object RPConfig {
    private var baseDir          = ""         // Base directory for RelPredict instance
    private var jobDir           = ""         // Directory where job specific information is kept
    private var modelBaseDir     = ""         // Base model directory where modeldef and current files are found
                                              // current file has the following information:
                                              //     current=<trained_model_dir>
                                              //     <target>=<algorithm>
                                              // so that <current>/<target>/<algorithm>/model will be loaded for predictions
    private var trainedModelDir  = ""         // Directory where the current trained models are found
                                              // This directory has subdirectories for each target, and each have subdirectories
                                              // for each algorithm that has produced a trained model.
    private var config  : Config = Config()   // The parsed command line information
    // Parse the command line. Order of prededence (highest to lowest priority) is:
    //     1. Command line args
    //     2. config file
    //     3. env variables
    def getConfig(cmd_line_args: Array[String]) : Option[Config] = {
      val clp                                 = new CommandLineParser()
      val parser                              = clp.getParser()
      // See if help is requested. If so, print it, then end. 
      if (cmd_line_args.length == 1 && cmd_line_args(0) == "--help") {
         parser.showUsage()
         ScalaUtil.end("Job")
         System.exit(0)
      }
      // Get as much information as we can find
      // ScalaUtil.controlMsg("Loading command line parms")
      var cmdlineConfig : Option[Config]      = parser.parse(cmd_line_args, Config())
      // cmdlineConfig.get.print()
      // ScalaUtil.controlMsg("Loading env parms")
      var envConfig     : Map[String, String] = System.getenv().asScala.toMap
      var cfgConfig     : Option[Config]      = None
      cmdlineConfig match { 
        case Some(cfg) => {
            if (cfg.config != "") {
                ScalaUtil.controlMsg("Loading config file from " + cfg.config)
                cfgConfig = parser.parse(loadConfig(cfg.config), Config())
                //cfgConfig.get.print()
            }
        }
        case None => ScalaUtil.controlMsg("Config file loading produced no resulting configuration")
      }
      // Now let's resolve everything
      config = config.setDefaults()
      //ScalaUtil.controlMsg("Defaults Merged")
      config = config.merge(envConfig)
      //ScalaUtil.controlMsg("Env Merged")
      //config.print()
      config = config.merge(cfgConfig)
      //ScalaUtil.controlMsg("Config Merged")
      //config.print()
      config = config.merge(cmdlineConfig)
      //ScalaUtil.controlMsg("Cmdline Merged (final)")
      setDirectories(config)
      Some(config)
    }
    def loadConfig(configFile: String) : Array[String] = {
      val source = scala.io.Source.fromFile(configFile)
      val parms = source.getLines.map(l => {
        val kv = l.split("=")
        List("--" + kv(0), kv(1))
      }).flatMap(x => x).toArray
      parms
    }
    def loadConfigToMap(configFile: String) : Map[String, String] = {
      val source = scala.io.Source.fromFile(configFile)
      var map = new scala.collection.mutable.Map[String, String]()
      source.getLines.foreach{l => {
        val kv = l.split("=")
        map(kv(0)) = kv(1)
      }}
      map.toMap
    }
    /**
     * Set up the base directory for RelPredict
     */
    def setBaseDir(dir : String) { 
      baseDir = if (dir.endsWith("/") || dir == "") dir else s"${dir}/"
      if (! new java.io.File(baseDir).exists) ScalaUtil.terminal_error(s"Base directory $baseDir does not exist")
    }
    /**
     * Get the base directory. Note that all directories returned will have "/" appended to the end.
     */
    def getBaseDir() = baseDir
    /**
     * Set up the job directory for RelPredict
     */
    def setJobDir(dir : String) { 
      jobDir = if (dir.endsWith("/") || dir == "") dir else s"${dir}/"
      if (! new java.io.File(jobDir).exists) ScalaUtil.terminal_error(s"Job directory $jobDir does not exist")
    } 
    /**
     * Set up the model directories for RelPredict. The base model directory hold the model definition
     * and a file that contains information about which trained models and algorithms are to be used.
     * The trained model directory is where all trained models are stored.
     */
    def setModelDir(model_class : String, model_name: String, model_version: String, model_run_date: String) { 
      modelBaseDir = getBaseDir() + "/models/" + model_class + "/" + model_name + "/" + model_version + "/"
      trainedModelDir = modelBaseDir + "/" + model_run_date
    }  
    def setDirectories(conf: Config) {
      setBaseDir(conf.base_dir)
      setJobDir(getBaseDir() + "jobs/" + conf.run_id)
      setModelDir(conf.model_class, conf.model_name, conf.model_version, conf.model_train_date)
    } 
    /**
     * Get the job directory. Note that all directories returned will have "/" appended to the end.
     */
    def getJobDir() = jobDir
    /**
     * Get the configuration directory
     */
    def getConfDir() = s"${baseDir}conf/"
    /**
     * Get the log directory
     */
    def getLogDir() = s"${baseDir}logs/"
    /**
     * Get the model directory for a specific model
     */
    def getModelDir() : String = modelBaseDir
    def getTrainedModelDir() : String = trainedModelDir
    /**
     * Get the model directory for a specific model and run ID. If none is specified, the current model is returned.
     */
    def getModelDir(model : Model, runID : String) : String = {
      if (runID == "") s"${getJobDir()}${getModelDir(model)}/current/"
      else s"${getJobDir()}${getModelDir(model)}/${runID}/"
    }
    /**
     * Get the target directory for a named target within a model
     */
    def getTargetDir(model : Model, runID : String, target : Target[_]) = {
      if (runID == "") s"${getModelDir(model, runID)}/${target.getName()}/"
      else s"${getModelDir(model)}/${runID}/${target.getName()}/"
    }
    /**
     * Get the algorithm directory for a specific algorithm used by a target within a model
     */
    def getAlgorithmDir(model : Model, runID : String, target : Target[_], algorithm : Algorithm) = s"${getTargetDir(model,  runID, target)}${algorithm.name}"
    /**
     * Get output directory for all saved data (from predict run).
     */
    def getDataDir() : String = s"${getBaseDir()}data/"
    /**
     * Get the output directory for a specific model
     */
    def getModelDataDir(model : Model) : String = s"${getDataDir()}${model.name}/${model.version}/"
    /**
     * Get the output directory for a model run
     */
    def getModelDataDir(model : Model, runID : String) : String = s"${getModelDataDir(model)}${runID}/"
    /**
     * Get the output directory for a model run target
     */
    def getTargetDataDir(model : Model, runID : String, target : Target[_]) = s"${getModelDataDir(model, runID)}${target.getName()}/"
    /**
     * Get the output directory for an algorithm and target for a model run
     */
    def getAlgorithmDataDir(model : Model, runID : String, target : Target[_], algorithm : Algorithm) = s"${getTargetDataDir(model,  runID, target)}${algorithm.name}"
}