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

case class PredictionRecordField(fieldName: String, fieldValue: Any)
case class PredictionRecord(fields: Array[PredictionRecordField])
case class PredictedRecord(id:         String, target:     String,
	                       prediction: String, probability: Double, 
	                       algorithm:  String, timestamp:  Date)

object RelPredictUtil extends GrammarDef {

	var modelMap: Map[String, Model] = scala.collection.mutable.Map[String, Model]()
	/**
	 *  Get a model. If it is not in cache, try to load it and put it there.
	 */
	def getModel(modelName: String) : Model = {
		if (!modelMap.contains(modelName)) 
			modelMap(modelName) = loadModel(modelName)
		return modelMap(modelName)
	}
	/**
	 *  Return an immutable copy of the current model cache
	 */    
	def getLoadedModels() = modelMap.toMap
	/**
	 *  Fully load a model.
	 *       The model definition will be loaded from the current version
	 *       Each target will be loaded with the current trained algorithm
	 */
	def loadModel(modelName: String, isLocalMode: Boolean) = {
        /* Load the model def file                     */
      val testModel : Reader = {
        if (isLocalMode()) {
          new FileReader(fileName)
        }
        else {
          SparkUtil.getHDFSFileReader(fileName).get
        }
      }
      // modelDef is defined in GrammarDef
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
		/* Find current trained models for each target */

		/* Load trained model files                    */

		/* Return the loaded model                     */
	}
	/**
	 *  Predict a single record using the current trained model
	 */
	def predictSingleRecord(modelName: String, predictionRecord: PredictionRecord) : String = {
		val model   = getModel(modelName)
		val vec     = VectorBuilder.buildSingleVector(predictionRecord)    
        val results = model.predict(vec)

        JsonConverter.toJson(results)
	}
	/**
	 *  Predict one or more records using the current trained model
	 */
	def predictRecords(modelName: String, predictionRecords: Array[PredictionRecord]) : String = {
		val model   = getModel(modelName)
		var results = new Results()
        results.addArray("results")
        predictionRecords.foreach{ r => {
  		     val vec = VectorBuilder.buildSingleVector(r)      
             results.put("results", model.predict(vec))
        }}
        JsonConverter.toJson(results)
	}
	/**
	 *  Clear the model cache so that any updates will be reloaded
	 */
	def reload() {
		modelMap.clear
	}
}
