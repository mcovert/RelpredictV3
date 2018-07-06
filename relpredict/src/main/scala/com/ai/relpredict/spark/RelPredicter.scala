package com.ai.relpredict.spark

import com.ai.relpredict.dsl._
import org.apache.spark.sql._
import com.ai.relpredict.util.{ScalaUtil, Datamap}
import com.ai.relpredict.jobs._
import com.ai.relpredict.RelPredictUtil
import com.ai.relpredict.spark.SparkUtil

/**
 * The Model class is an implementation of a ModelDef specification. It is the container for all components.
 */
case class Relpredicter(model_class : String, model_name: String, model_version: String) {
	val ss:          SparkSession     = SparkUtil.buildSparkSession("relpredicter", "yarn")
    val modelDef:    Option[ModelDef] = RelPredictUtil.getModelDef(model_class, model_name, model_version)
    var model:       Option[Model]    = None
    val modelConfig: ModelConfig      = new ModelConfig(model_class, model_name, model_version)
    var records_processed: Int    = 0
    var processing_time:   Double = 0.0

    modelDef match {
    	case Some(md: ModelDef) => {
    		model = new Model(md, None, new Datamap())
            modelConfig.loadFromCurrent()
            modelConfig.configure(model, ss)
    	}
        case None => ScalaUtil.writeError(s"Model for ${model_class}/${model_name}/${model_version} could not be loaded.")
    }
    def predict(row: Row): Array[PredictedRecord] = {
    	val starttime = new Date()
        var vectors	   = scala.collection.mutable.Map[String, Vector]()
        var v: (String, Vector)
        var predictions = scala.collection.mutable.ArrayBuffer[PredictedRecord]()
        model.targets.foreach(t => {
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
               predictions += alg.predictOne(v)
               records_processed += 1
            }
          }
        )
        val endtime = new Date()
        processing_time += ((endtime.getTime - starttime.getTime)/1000.0).toDouble
        predictions.toArray
    }
    def stats() = (records_processed, processing_time)
    def reset() {
    	records_processed = 0
    	processing_time = 0.0
    }
}
