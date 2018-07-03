package com.ai.relpredict.jobs

import com.ai.relpredict.dsl._
import org.apache.spark.sql.SparkSession
import org.apache.spark.rdd.RDD
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.mllib.tree.model.{DecisionTreeModel, Node}
import com.ai.relpredict.util._
import com.ai.relpredict.spark._
import org.apache.spark.mllib.linalg.{Vector, Vectors}
import org.apache.spark.mllib.regression.LabeledPoint

/**
 * The Prediction job uses a save trained model to predict targets on new data.
 */
case class PredictionJob(override val jobname: String, override val model: com.ai.relpredict.spark.Model, 
                         override val config : Config, ss : SparkSession, df : DataFrame, 
                         override val dataMaps: Map[String, Datamap], override val columnMap: Datamap, 
                         override val jobParms : Map[String, String])
   extends Job(jobname: String,  model: Model, config: Config, jobParms : Map[String, String],
               dataMaps: Map[String, Datamap], columnMap: Datamap) {
    def run() {
       import ss.implicits._
       // Configure the model using the current trained model file. This will also load the trained models for each target.
       val modelConfig = new ModelConfig(config.model_class, config.model_name, config.model_version)
       modelConfig.loadFromCurrent()
       modelConfig.configure(model, ss)
       modelConfig.print()

       val pVecs = VectorBuilder.buildPredictionDataFrames(ss, model, df)
       ScalaUtil.writeInfo(s"Prediction RDD array length is ${pVecs.size}")
       pVecs.foreach{rdf => { rdf.collect.foreach{println}}}
       var vPos = 0
       val pred = model.targets.map(t => {
          ScalaUtil.writeInfo(s"Processing target ${t.getName()}")
          val res = t.algorithms.map(a => { 
            ScalaUtil.writeInfo(s"Processing algorithm ${a.get.name}")
            if (modelConfig.runAlgorithm(t.getName(), a.get.name)) {
               a.get.start()
               val res = a.get.predict(pVecs(vPos))
               res match {
                 case None => ScalaUtil.writeError(s"Target ${t.getName()} algorithm ${a.get.name} encountered an error.")
                 case Some(x) => {
                    val rDF = SparkUtil.getPredictedDataFrame(jobname, config.model_class, config.model_name, config.model_version, 
                                                              modelConfig.getTrainedModelDate(), t, a.get, x._2)
                    rDF.show(false)
                    // TO-DO: save predicted data frame to Hive table
                 }
               }
               a.get.end().print("")
            }
          })
          vPos += 1
          res
       })
    }
}