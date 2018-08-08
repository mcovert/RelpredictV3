package com.ai.rplite

import scala.collection.mutable.ArrayBuffer
import scala.collection.mutable.Map
import com.ai.relpredict.util.ScalaUtil
import com.ai.relpredict.spark.{Model, ModelConfig}
import com.ai.relpredict.dsl._
import org.apache.spark.sql.SparkSession

case class RPLConfig {
  private var model:  RPLModel     = null
  private var configMap            = scala.collection.mutable.Map[String, String]()
  private var baseDir              = "/relpredict/"
  var jobName:        String       = "rplite"
  var sparkMaster:    String       = "yarn"
  var ss:             SparkSession = null
  var localMode:      Boolean      = true
  def setLocalMode(mode: Boolean) { localMode = mode }
  def isLocalMode() = localMode
  /**
   *    baseDir 
   *      +-/models/model_class/model_name/model_version
   *         - modeldef
   *         - current
   *         - results
   *         +-/model_train_date
   *            +-/target
   *               +-/algorithm
   *                -results
   *                <saved models>
   */
  def getBaseDir()         = baseDir
  def getModelBaseDir()    = getBaseDir()      + "models/" 
  def getModelDir()        = getModelBaseDir() + model_class + "/" + 
                                                 model_name + "/" + 
                                                 model_version + "/" 
  def getTrainedModelDir() = getModelDir()     + model_train_date + "/"

  def getSparkSession(jobName: String, sparkMaster: String) = {
    ss = SparkSession.builder().appName(jobName).config("spark.master", sparkMaster).enableHiveSupport().getOrCreate() 
  }

  /**
   * Load a standard key=value pair configuration file
   *      MODEL=<model_class/model_name/model_version>
   *      RUN_TYPE= train | predict
   *      INPUT=<sql select statement> | <file_name>
   *      OUTPUT=HIVE | <file_name>
   * Optional:     
   *      BASEDIR=/relpredict
   *      SPLIT=<0.0-1.0>
   *      ENV=yarn | local
   *      JOBNAME=rplite
   */
  def loadConfigFile(fileName: String) : Map[String, String] = {
    var configMap = scala.collection.mutable.Map[String, String]()
      val source = scala.io.Source.fromFile(fileName)
      source.getLines.foreach{l => {
      	val tokens = l.split("=")
      	if (tokens.size() == 2)
      	  configMap(tokens(0).toUpperCase(), tokens(1))
      	else if (tokens.size() == 1)
      	  configMap(tokens(0).toUpperCase(), "")
      	else if (tokens.size() == 0 || tokens.size() > 2) {}
      }
      if (configMap.contains("BASEDIR")) baseDir = configMap("BASEDIR")
      if (baseDir.endsWith("/")) baseDir
      else baseDir + "/"
      if (configMap.contains("JOBNAME")) jobName = configMap("JOBNAME")
      if (configMap.contains("SPARK_MASTER")) sparkMaster = configMap("SPARK_MASTER")
      configMap.toMap    
  }
  /**
   * Load minimal model definition file:
   *      model     class/name/version
   *      id        name
   *      feature   name type p1=v1 p2=v2 ...
   *      target    name type p1=v1 p2=v2 ...
   *      algorithm name p1=v1 p2=v2 ...
   */
  def loadModelFile(fileName: String) : RPLModel {
      var flist = scala.collection.mutable.ListBuffer[RPLFeature]()
      var tlist = scala.collection.mutable.ListBuffer[RPLTarget]()
      val source = scala.io.Source.fromFile(fileName)
      source.getLines.foreach{l => {
      	val tokens = l.split("[ ]+")
        tokens(0) match {
       	   case "model"     => model = createModel(l.substring(6).trim())
           case "id"        => model.setId(l.substring(3).trim())
           case "feature"   => {
               model.addFeature(RPLFeature(tokens(1), tokens(2)))
               for (i <- 3 to (tokens.length - 1)) model.addParm(tokens(i))
           }
           case "target"    => {
               model.addTarget(RPLTarget(tokens(1), tokens(2)))
               for (i <- 3 to (tokens.length - 1)) model.addParm(tokens(i))
           }
           case "algorithm" => {
               model.addAlgorithm(RPLAlgorithm(tokens(1)))
               for (i <- 2 to (tokens.length - 1)) model.addParm(tokens(i))
           }
           case "#"         => 
           case _           => ScalaUtil.writeError(s"Unknown statement: ${l}")
        }
      }} 
  }
  /**
   * Load the model from what is specified in the "current" file:
   *      trained_model=<model_train_date>
   *      target=algorithm
   *      target=algorithm
   *      ...
   *
   * This load process will create a set of Pipeline objects that can be used to predict.
   *      A Pipeline object consists of a set of transformers (feature encoders) that transforms
   *      one or more input records (i.e. a Dataframe or a single Row) into a feture vector, and 
   *      an estimator (algorithm) that makes the prediction.
   *         Note that RPLEncoder has both an encoder and a decoder PipelineStage (record in, record out). 
   */
   def loadModelFromCurrent() {
       val currentFile = s"${getModelDir()}current"
       val source = scala.io.Source.fromFile(currentFile)
       if (!fileExists(currentFile)) {
          println(s"Model configuration file ${currentFile}cannot be loaded. This is a fatal error.")
          System.exit(-1)
       }
       source.getLines.foreach{line => { 
         if (!line.isEmpty()) {            
           val tokens = line.split("=")
           tokens(0) match {
              case "trained_model" => {
                  trained_model = tokens(1)
                  model.loadTrainedModel(trained_model)
              }
              case _ => addTargetAlgorithm(tokens(0), tokens(1))
            }
          }
       }
          case None => ScalaUtil.terminal_error(s"Model configuration file ${currentFile}cannot be loaded. This is a fatal error.")
       }
  }
  /**
   *   Create an RPLModel object from a model definition string ("model_class/model_name/model_version"). Note that model_train_date
   *   is set at a later time based on whether this is a prediction run or a training run.
   */
  private def createModel(mdef: String) : RPLModel = {
      val mt = mdef.substring(6).trim().split("/")
      if (mt.size < 2) ScalaUtil.terminal_error(s"Model name $mdef is invalid")
      val modelClass                       = mt(0)
      val modelName                        = mt(1)
      val modelVersion = if (mt.size > 2) mt(2) else "1"
      val modelTrainDate = if (mt.size > 3) mt(3) else ""
      if (mt.size > 4) ScalaUtil.writeWarning(s"Too many model parameters. Some are ignored.")
      RPLModel(modelClass, modelName, modelVersion, modelTrainDate)
  }
}