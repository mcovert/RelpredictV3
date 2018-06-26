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

case class PredictionRecordField(fieldName: String, fieldType: String, fieldValue: String)
case class PredictionRecord(fields: Array[PredictionRecordField])

case class PredictedRecord(id:         String, model:       String,  target:      String,    algorithm:  String,
	                       prediction: String, probability: String,  timestamp:   String)
case class PredictedRecords(records: Array[PredictedRecord])

object RelPredictUtil extends GrammarDef {

	var modelMap: scala.collection.mutable.Map[String, Model] = scala.collection.mutable.Map[String, Model]()
	/**
	 *  Get a model. If it is not in cache, try to load it and put it there.
	 */
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
