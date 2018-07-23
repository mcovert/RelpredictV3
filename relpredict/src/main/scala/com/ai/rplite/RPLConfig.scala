package com.ai.rplite

import scala.collection.mutable.ArrayBuffer
import scala.collection.mutable.Map
import com.ai.relpredict.util.ScalaUtil
import com.ai.relpredict.spark.{Model, ModelConfig}
import com.ai.relpredict.dsl._
import org.apache.spark.sql.SparkSession

class RPLConfig {
  var modelClass                      = ""
  var modelName                       = Array[String]()
  val fsetName                        = "fset"
  var data      : String              = ""
  var modelId   : String              = "id"
  var model     : Option[Model]       = None
  var run       : ArrayBuffer[String] = ArrayBuffer[String]()
  var modelDef  : Option[ModelDef]    = None

  def getQuery() = data.toString

  def getJobs() = run.toArray
  
  def load(fileName: String, ss: SparkSession) {
      // Load the configuration file
      var flist = scala.collection.mutable.ListBuffer[FeatureDef]()
      var tlist = scala.collection.mutable.ListBuffer[TargetDef]()
      val source = scala.io.Source.fromFile(fileName)
      source.getLines.foreach{l => {
      	val tokens = l.split("[ ]+")
        tokens(0) match {
       	   case "model"    => modelName = l.substring(6).trim().split("/")
           case "id"       => modelId = l.substring(3).trim()
           case "feature"  => flist += new FeatureDef(tokens(1), tokens(2), "", "")
           case "target"   => tlist += new TargetDef(tokens(1), tokens(2), "", tokens(4), fsetName, "")
           case "data"     => data = l.substring(5).trim()
           case "run"      => l.substring(4).trim.split("[ ]+")
           case "#"        => 
           case _          => ScalaUtil.writeError(s"Unknown statement: ${l}")
        }
      }} 
      // Build the ModelDef
      modelClass = modelName(0)
      val fset = FeatureSetDef(fsetName, flist.toList, modelId)
      modelDef = Some(ModelDef(modelName(1), modelName(2), "", List(fset), tlist.toList))
      // Build the model (which will load required data)
      import ss.implicits._
      import ss.sqlContext.implicits._
      // Configure the model using the current trained model file. This will also load the trained models for each target.
      val modelConfig = new ModelConfig(modelClass, modelName(1), modelName(2))
      modelConfig.loadFromCurrent()
      //modelConfig.configure(model, ss) 
  }
}