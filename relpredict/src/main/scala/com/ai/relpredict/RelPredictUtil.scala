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
	/**
	 *  Get a model. If it is not in cache, try to load it and put it there.
	 */
	 def getTrainedModel(model_class: String, model_name: String, model_version: String) : Option[Model] = {
	 	var model : Option[Model] = None
	 	getModelDef(model_class, model_name, model_version) match {
	 	    case Some(modelDef: ModelDef) => model = Some(new Model(modelDef, new Datamap("")))
	 	    case _ => ScalaUtil.writeError(s"Load of model definition for $model_class, $model_name, $model_version failed")	
	 	}
	 	model
	 }
	 // def getTrainedModelFromConfig(model_class: String, model_name: String, model_version: String) : Model = {

	 // }

	 def getModelDef(model_class: String, model_name: String, model_version: String) : Option[ModelDef] = {
        getModelDef(RPConfig.getModelDir() + "modeldef")
	 }
    // Load the model definition file
    def getModelDef(fileName : String) : Option[ModelDef] = {
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
	 *  Predict a single record using the current trained model
	 */
	// def predictSingleRecord(modelName: String, predictionRecord: PredictionRecord) : String = {
	// 	val model   = getModel(modelName)
	// 	val vec     = VectorBuilder.buildSingleVector(predictionRecord)    
 //        val results = model.predict(vec)

 //        JsonConverter.toJson(results)
	// }
	/**
	 *  Predict one or more records using the current trained model
	 */
	// def predictRecords(modelName: String, predictionRecords: Array[PredictionRecord]) : String = {
	// 	val model   = getModel(modelName)
	// 	var results = new Results()
 //        results.addArray("results")
 //        predictionRecords.foreach{ r => {
 //  		     val vec = VectorBuilder.buildSingleVector(r)      
 //             results.put("results", model.predict(vec))
 //        }}
 //        JsonConverter.toJson(results)
	// }
	/**
	 *  Clear the model cache so that any updates will be reloaded
	 */
	def reload() {
		modelMap.clear
	}
}
