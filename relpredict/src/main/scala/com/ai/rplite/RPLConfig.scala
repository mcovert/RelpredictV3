package com.ai.rplite

import scala.collection.mutable.ArrayBuffer
import scala.collection.mutable.Map
import com.ai.relpredict.util.ScalaUtil
import com.ai.relpredict.spark.{Model, ModelConfig}
import com.ai.relpredict.dsl._
import org.apache.spark.sql.SparkSession

class RPLConfig {
  var data      : String              = ""
  var run       : ArrayBuffer[String] = ArrayBuffer[String]()
  var modelDef  : RPLModel = null

  def getQuery() = data.toString

  def getJobs() = run.toArray
  
  def load(fileName: String, ss: SparkSession) {
      // Load the configuration file
      var flist = scala.collection.mutable.ListBuffer[RPLFeature]()
      var tlist = scala.collection.mutable.ListBuffer[RPLTarget]()
      val source = scala.io.Source.fromFile(fileName)
      source.getLines.foreach{l => {
      	val tokens = l.split("[ ]+")
        tokens(0) match {
       	   case "model"     => modelDef = createModelDef(l.substring(6).trim())
           case "id"        => modelDef.setId(l.substring(3).trim())
           case "feature"   => modelDef.addFeature(RPLFeature(tokens(1), tokens(2)))
           case "target"    => modelDef.addTarget(RPLTarget(tokens(1), tokens(2)))
           case "algorithm" => {
               modelDef.addAlgorithm(RPLAlgorithm(tokens(1)))
               for (i <- 2 to (tokens.length - 1)) modelDef.addParm(tokens(i))
           }
           case "data"      => data = l.substring(5).trim()
           case "run"       => l.substring(4).trim.split("[ ]+")
           case "#"         => 
           case _           => ScalaUtil.writeError(s"Unknown statement: ${l}")
        }
      }} 
  }
  private def createModelDef(mdef: String) : RPLModel = {
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