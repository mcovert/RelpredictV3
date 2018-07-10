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

	var modelCache = new ModelCache()
	def makeModelNameString(model_class: String, model_name: String, model_version: String) = model_class + "/" + model_name + "/" + model_version
	def makeTrainedModelNameString(model_class: String, model_name: String, model_version: String, model_train_date: String) = 
		  model_class + "/" + model_name + "/" + model_version + "/" + model_train_date
	/**
	 *  Get a model. If it is not in cache, try to load it and put it there.
	 */
	 def getModel(model_class: String, model_name: String, model_version: String, ss: SparkSession) : Option[Model] = {
	 	modelCache.get(model_class, model_name, model_version) match {
	 		case Some(m: Model) => return Some(m)
	 		case _ => 
	 	}
	 	getModelDef(model_class, model_name, model_version) match {
	 		case Some(md: ModelDef) => {
	 			val model = new com.ai.relpredict.spark.Model(md, None, new Datamap(""))
	 			val modelConfig = new ModelConfig(model_class, model_name, model_version)
                modelConfig.loadFromCurrent()
                modelConfig.configure(model, ss)
                modelCache.add(model_class, model_name, model_version, model)
                Some(model)
	 		}
	 	    case _ => None
	 	}
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
		modelCache.reset()
	}
}
