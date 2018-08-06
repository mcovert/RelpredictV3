package com.ai.relpredict

import com.ai.relpredict.jobs.RPConfig
import com.ai.relpredict.util._
import java.io._
import org.apache.spark.sql.SparkSession

case class ModelConfig(model_class: String, model_name: String, model_version: String) {
	var trained_model = ""
	var algMap = scala.collection.mutable.Map[String, scala.collection.mutable.HashSet[String]]()
	var runAll = false
    
    def getModelString() = model_class + "/" + model_name + "/" + model_version + "/" + trained_model
	def getTrainedModelDate() = trained_model
	def addTargetAlgorithm(t: String, a: String) {
		if (algMap.contains(t)) algMap(t) += a
        else {
        	var list = scala.collection.mutable.HashSet[String]()
        	list += a
        	algMap(t) = list
        }
	}
	def setRunAll(all: Boolean) { runAll = all }
	def runAlgorithm(t: String, a: String) : Boolean = {
		if (runAll || (algMap.contains(t) && algMap(t).contains(a))) true
		else false
	}
	def loadFromCurrent() {
       RPConfig.setModelDir(model_class, model_name, model_version)
       val currentFile = s"${RPConfig.getModelDir()}current"
       SparkUtil.getHDFSFileReader(currentFile) match {
       	  case Some(br: BufferedReader) => {
       	  	while (br.ready) {
       	  		val line = br.readLine
       	  		val tokens = line.split("=")
       	  		tokens(0) match {
       	  			case "trained_model" => {
       	  				trained_model = tokens(1)
       	  				RPConfig.setTrainedModelDir(model_class, model_name, model_version, trained_model)
       	  			}
       	  			case _ => addTargetAlgorithm(tokens(0), tokens(1))
       	  		}
       	  	}
            br.close
       	  }
       	  case None => ScalaUtil.terminal_error(s"Model configuration file ${currentFile}cannot be loaded. This is a fatal error.")
       }
	}
	def print() {
		ScalaUtil.writeInfo(s"Trained model is ${trained_model}")
		algMap.keys.foreach{ k => {
			ScalaUtil.writeInfo(s">>> Target=${k}")
			algMap(k).foreach{ s => ScalaUtil.writeInfo(s">>>>>> Algorithm=${s}")}
		}}
	}
	def configure(model: Model, ss: SparkSession) {
		model.targets.foreach{ t => {
			t.algorithms.foreach{ a => {
			   if (runAlgorithm(t.getName(), a.get.name)) {
			   	 val algDir = RPConfig.getAlgorithmDir(t, a.get)
			   	 ScalaUtil.controlMsg(s"Loading trained model for ${t.getName()} using algorithm ${a.get.name} from ${algDir}")
			   	 a.get.loadModel(ss, algDir)
			   }
			   else ScalaUtil.controlMsg(s"Trained model for ${t.getName()} using algorithm ${a.get.name} is not configured.")
		    }
	    }}}
	}
}