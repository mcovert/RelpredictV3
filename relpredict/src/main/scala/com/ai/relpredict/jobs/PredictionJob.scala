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
case class PredictionJob(jobname: String, modelDef: com.ai.relpredict.spark.Model, config : Config, 
                       ss : SparkSession, df : DataFrame, dMap: Map[String, Datamap], columnMap: Datamap, 
                       jobParms : Map[String, String], results: Results)
   extends Job(jobname: String,  modelDef: Model, config: Config, jobParms : Map[String, String],
               dMap: Map[String, Datamap], columnMap: Datamap, results: Results) {
    def run() : Results = {
       import ss.implicits._
       val df = ss.sqlContext.sql(config.sql)
       df.cache
       val pVecs = VectorBuilder.buildPredictionDataFrames(ss, modelDef, df)
       var vPos = 0
       val pred = modelDef.targets.map(t => {
          val res = t.algorithms.map(a => { 
            /* TO-DO: Load the saved model into the algorithm */
            a.get.loadModel(ss, s"${modelDef.name}/${modelDef.version}/${config.run_id}/${t.getName()}/${a.get.name}")
            a.get.start()
            val res = a.get.predict(pVecs(vPos))
            res match {
              case None => ScalaUtil.writeError(s"Target ${t.getName()} algorithm ${a.get.name} encountered an error.")
              case Some(x) => {
                 val rDF = SparkUtil.getPredictedDataFrame(ss, jobname, t.getName(), a.get.name, x._2)
                 val dir = RPConfig.getBaseDir()
                 val runID = ScalaUtil.getDirectoryDate()
                 rDF.write.save(RPConfig.getAlgorithmDataDir(modelDef, runID, t, a.get))
              }
            }
          })
          vPos += 1
          res
       })
       baseResults
    }
}