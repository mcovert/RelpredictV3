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
case class PredictionJob(jn: String, model: Model, conf : Config, ss : SparkSession, df : DataFrame, dm: Datamap, jobParms : Map[String, String])
   extends Job(jn: String, model: Model, conf : Config, jobParms : Map[String, String]) {
    def run() : Results = {
       import ss.implicits._
       val df = ss.sqlContext.sql(conf.sql)
       df.cache
       var r = new Results()
       val pVecs = VectorBuilder.buildPredictionDataFrames(ss, model, df)
       var vPos = 0
       val pred = model.targets.map(t => {
          val res = t.algorithms.map(a => { 
            /* TO-DO: Load the saved model into the algorithm */
            a.get.loadModel(ss, s"${model.name}/${model.version}/${conf.run_id}/${t.getName()}/${a.get.name}")
            a.get.start()
            val res = a.get.predict(pVecs(vPos))
            res match {
              case None => ScalaUtil.writeError(s"Target ${t.getName()} algorithm ${a.get.name} encountered an error.")
              case Some(x) => {
                 val predictMsg = a.get.getTerminationStats(t.getName(), "predict")
                 ScalaUtil.controlMsg(predictMsg)
                 r.addString(s"job.predict.${model.name}.${t.getName()}.${a.get.name}.status.msg", predictMsg)          
                 r.merge(res.get._1)
                 val rDF = SparkUtil.getPredictedDataFrame(ss, jobname, t.getName(), a.get.name, x._2)
                 val dir = RPConfig.getBaseDir()
                 val runID = ScalaUtil.getDirectoryDate()
                 rDF.write.save(RPConfig.getAlgorithmDataDir(model, runID, t, a.get))
              }
            }
          })
          vPos += 1
          res
       })
       r
    }
}