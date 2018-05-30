package com.ai.relpredict.jobs

import com.ai.relpredict.util.ScalaUtil
import com.ai.relpredict.spark._
import scala.collection.JavaConverters._

object RPConfig {
    private var baseDir = ""
    private var jobDir  = ""
    private var config  : Config = Config()
    // Parse the command line. Order of prededence (highest to lowest priority) is:
    //     1. Command line args
    //     2. config file
    //     3. env variables
    def getConfig(cmd_line_args: Array[String]) : Option[Config] = {
      val clp                                 = new CommandLineParser()
      val parser                              = clp.getParser()
      // Get as much information as we can find
      var cmdlineConfig : Option[Config]      = parser.parse(cmd_line_args, Config())
      var envConfig     : Map[String, String] = System.getenv().asScala.toMap
      var cfgConfig     : Option[Config]      = None
      cmdlineConfig match { 
        case Some(cfg) => {
            if (cfg.config != "") {
                ScalaUtil.controlMsg("Loading config file from " + cfg.config)
                cfgConfig = parser.parse(loadConfig(cfg.config), Config())
            }
        }
        case None =>
      }
      // Now let's resolve everything
      this.config = Config().merge(envConfig).merge(cfgConfig).merge(cmdlineConfig).setDefaults()
      this.config.print
      Some(this.config)
    }
    def loadConfig(configFile: String) : Array[String] = {
      val source = scala.io.Source.fromFile(configFile)
      val parms = source.getLines.map(l => {
        val kv = l.split("=")
        List("--" + kv(0), kv(1))
      }).flatMap(x => x).toArray
      parms
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
    def getModelDir(model : Model) : String = s"${baseDir}models/${model.name}/${model.version}/"
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