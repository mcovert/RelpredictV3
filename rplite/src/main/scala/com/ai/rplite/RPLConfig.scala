package com.ai.rplite

import scala.collection.mutable.ArrayBuffer
import scala.collection.mutable.Map
import com.ai.relpredict.util.ScalaUtil
import com.ai.relpredict.spark.{Model, ModelConfig}
import com.ai.relpredict.dsl._
import org.apache.spark.sql.SparkSession

object RPLConfig {
  var model : RPLModel = null
  var configMap = scala.collection.mutable.Map[String, String]()
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
      	  configMap(tokens(0).toUppercase(), tokens(1))
      	else if (tokens.size() == 1)
      	  configMap(tokens(0).toUppercase(), "")
      	else if (tokens.size() == 0 || tokens.size() > 2) {}
      }
      config.toMap    
  }
  /**
   * Load minimal model definition file:
   *      model     class/name/version
   *      id        name
   *      feature   name type
   *      target    name type
   *      algorithm name p1=v1 p2=v2 ...
   */
  def loadModelFile(fileName: String) : RPLModel {
      var flist = scala.collection.mutable.ListBuffer[RPLFeature]()
      var tlist = scala.collection.mutable.ListBuffer[RPLTarget]()
      val source = scala.io.Source.fromFile(fileName)
      source.getLines.foreach{l => {
      	val tokens = l.split("[ ]+")
        tokens(0) match {
       	   case "model"     => model = createModelDef(l.substring(6).trim())
           case "id"        => model.setId(l.substring(3).trim())
           case "feature"   => model.addFeature(RPLFeature(tokens(1), tokens(2)))
           case "target"    => model.addTarget(RPLTarget(tokens(1), tokens(2)))
           case "algorithm" => {
               model.addAlgorithm(RPLAlgorithm(tokens(1)))
               for (i <- 2 to (tokens.length - 1)) model.addParm(tokens(i))
           }
           case "#"         => 
           case _           => ScalaUtil.writeError(s"Unknown statement: ${l}")
        }
      }} 
  }
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