package com.ai.rplite

import scala.collection.mutable.ArrayBuffer
import scala.collection.mutable.Map
import com.ai.relpredict.utils.ScalaUtil
import com.ai.relpredict.spark.Model

case class FeatureDef(val featureName: String, val featureType: String) 
case class TargetDef(val targetName : String, val TargetType: String, val algList: Array[String])
case class ModelDef (val modelName: String) {
  val mcParts : Array[String] = modelName.split("/")
  val model_class = mcParts(0)
  val model_name = mcParts(1)
  val model_version = mcParts(2)
  var features : ArrayBuffer[FeatureDef] = new ArrayBuffer[FeatureDef]()
  val targets  : ArrayBuffer[TargetDef] = new ArrayBuffer[TargetDef]()
}

class RPLConfig {
  
  var modelDef : ModelDef
  var model    : com.ai.relpredict.spark.Model
  var data     : String = ""
  var run      : ArrayBuffer[String] = ArrayBuffer[String]("predict")
  
  def loadConfig(fileName: String) {
      val source = scala.io.Source.fromFile(fileName)
      source.getLines.foreach{l => {
      	val tokens = l.split("[ ]+")
        tokens(0) match {
       	   case "model"    => modelDef = new ModelDef(l)
           case "feature"  => modelDef.features += new FeatureDef(tokens(1), tokens(2))
           case "target"   => modelDef.targets += new TargetDef(tokens(1), tokens(2), tokens(4).split(","))
           case "data"     => data = l.substring(4).trim()
           case "run"      => l.substring(3).trim.split(",")
           case "#"        => 
           case _          => ScalaUtil.writeError(s"Unknown statement: ${l}")
        }
      }}    
  }
  def loadModel() {
    
  }
  def run() {}
}