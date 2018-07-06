package com.ai.relpredict

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
import com.ai.relpredict.jobs.RPConfig

case class PredictionRecordField(fieldName: String, fieldType: String, fieldValue: String)
case class PredictionRecord(fields: Array[PredictionRecordField])

case class PredictedRecord(id:         String, model:       String,  target:      String,    algorithm:  String,
	                       prediction: String, probability: String,  timestamp:   String)
case class PredictedRecords(records: Array[PredictedRecord])

object RelPredictUtil extends GrammarDef {

	var modelMap: scala.collection.mutable.Map[String, Model] = scala.collection.mutable.Map[String, Model]()
	def makeModelNameString(model_class: String, model_name: String, model_version: String) = model_class + "/" + model_name + "/" + model_version
	def makeTrainedModelNameString(model_class: String, model_name: String, model_version: String, model_train_date: String) = 
		  model_class + "/" + model_name + "/" + model_version + "/" + model_train_date
	/**
	 *  Get a model. If it is not in cache, try to load it and put it there.
	 */
	 def getTrainedModel(model_class: String, model_name: String, model_version: String) : Option[Model] = {
	 	val modelName = makeModelNameString(model_class, model_name, model_version)
	 	// See if it's cached
	 	if (modelMap.contains(modelName))
	 		return Some(modelMap(modelName))
	 	var model : Option[Model] = None
	 	getModelDef(model_class, model_name, model_version) match {
	 	    case Some(modelDef: ModelDef) => {
	 	    	model = Some(new Model(modelDef, None, new Datamap("")))
	 	    	// val currentFile = RPConfig.getModelDir() + "current"
	 	    	// if (!SparkUtil.hdfsFileExists(currentFile))
	 	    	// 	ScalaUtil.terminal_error(s"The trained model configuration file ${currentFile} does not exists. This moel cannot be used. This is a terminal error.")
	 	    	// model.get.loadCurrent(currentFile)
	 	    }
	 	    case _ => ScalaUtil.writeError(s"Load of model definition for $model_class, $model_name, $model_version failed")	
	 	}
	 	// Cache it
	 	modelMap(modelName) = model.get
	 	model
	 }
	 def getModelDef(model_class: String, model_name: String, model_version: String) : Option[ModelDef] = {
        getModelDefFromFile(RPConfig.getModelDir() + model_name + ".modeldef")
	 }
    // Load the model definition file
    def getModelDefFromFile(fileName : String) : Option[ModelDef] = {
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
	/**
	 *  Clear the model cache so that any updates will be reloaded
	 */
	def reload() {
		modelMap.clear
	}
}
