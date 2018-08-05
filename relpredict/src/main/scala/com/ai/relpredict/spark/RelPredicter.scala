package com.ai.relpredict.spark

import com.ai.relpredict.dsl._
import org.apache.spark.sql._
import com.ai.relpredict.util.{ScalaUtil, Datamap}
import com.ai.relpredict.jobs._
import com.ai.relpredict._
import java.util.Date
import org.apache.spark.mllib.linalg.{Vector, Vectors}

/**
 * The Model class is an implementation of a ModelDef specification. It is the container for all components.
 * Usage:
 *         val rp = Relpredicter("Claims", "denials", "1")
 *
 *         val resultDf = dataFrame.map(r: row => rp.predict(r))
 *         - or -
 *         val resultArray = rp.predict(dataFrame.toArray)
 *
 *         val stats = rp.stats()   // Gives records processed and elapsed time
 *         rp.reset()               // Resets all statistics
 */
case class Relpredicter(model_class : String, model_name: String, model_version: String) {
	  val ss:          SparkSession     = SparkUtil.buildSparkSession("relpredicter", "yarn")
    val modelDef:    Option[ModelDef] = RelPredictUtil.getModelDef(model_class, model_name, model_version)
    var model:       Option[Model]    = None
    val modelConfig: ModelConfig      = new ModelConfig(model_class, model_name, model_version)
    var records_processed: Int        = 0
    var processing_time:   Double     = 0.0

    def loadTrainedModel() {
      modelDef match {
      	case Some(md: ModelDef) => {
      		model = Some(new Model(md, None, new Datamap("")))
          modelConfig.loadFromCurrent()
          modelConfig.configure(model.get, ss)
      	}
        case None => ScalaUtil.writeError(s"Model for ${model_class}/${model_name}/${model_version} could not be loaded.")
      }
    }
    def getModel() : Model = {
      model match {
        case Some(m) => m
        case None    => {
          ScalaUtil.terminal_error(s"No model has been loaded. This error is terminal.")
          model.get
        }
      }
    }
    def predict(rows: Array[Row]) : Array[PredictedRecord] = {
    	rows.flatMap(r => predict(r))
    }
    def predict(row: Row): Array[PredictedRecord] = {
    	val starttime = new Date()
      var vectors	   = scala.collection.mutable.Map[String, (String, Vector)]()
      var v: (String, Vector) = null
      var predictions = scala.collection.mutable.ArrayBuffer[PredictedRecord]()
      model match {
        case Some(m) =>
        case None    => loadTrainedModel()
      }
      model.get.targets.foreach(t => {
       	  val target_name = t.getName()
       	  val fset_name = t.getFeatureSet().name
       	  if (vectors.contains(fset_name)) v = vectors(fset_name)
       	  else {
       	  	v = VectorBuilder.buildPredictionVector(t, row)
       	  	vectors(fset_name) = v
       	  }
          t.algorithms.foreach(a => { 
          	val alg = a.get
            if (modelConfig.runAlgorithm(target_name, alg.name)) {
               val pred_rec = alg.predictOne(v)
               predictions += new PredictedRecord(pred_rec._1, 
                                                  modelConfig.getModelString(),  
                                                  target_name,    
                                                  alg.name,
	                                                pred_rec._2.toString, 
                                                  "0",  
                                                  starttime.toString)
               records_processed += 1
            }
          })
      })
      val endtime = new Date()
      processing_time += ((endtime.getTime - starttime.getTime)/1000.0).toDouble
      predictions.toArray
    }
    def stats() = (records_processed, processing_time)
    def reset() {
    	records_processed = 0
    	processing_time   = 0.0
    }
}
