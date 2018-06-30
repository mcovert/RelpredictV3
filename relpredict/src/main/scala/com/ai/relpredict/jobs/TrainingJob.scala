package com.ai.relpredict.jobs

import com.ai.relpredict.spark._
import org.apache.spark.sql.SparkSession
import org.apache.spark.rdd.RDD
import org.apache.spark.mllib.linalg.{Vector, Vectors}
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.mllib.regression.LabeledPoint
import org.apache.spark.mllib.tree.model.{DecisionTreeModel, Node}
import com.ai.relpredict.util.{ScalaUtil, Datamap, Results}
import com.ai.relpredict.spark.{VectorBuilder, SparkUtil, Target, AlgorithmFactory, Model}
import org.apache.spark.sql.catalyst.encoders.RowEncoder
import org.apache.spark.sql.Row
import scala.collection.mutable.ArrayBuffer


case class TrainingJob(override val jobname: String, override val model: com.ai.relpredict.spark.Model, 
                       override val config : Config, ss : SparkSession, df : DataFrame, 
                       override val dataMaps: Map[String, Datamap], override val columnMap: Datamap, 
                       override val jobParms : Map[String, String])
   extends Job(jobname: String,  model: Model, config: Config, jobParms : Map[String, String],
               dataMaps: Map[String, Datamap], columnMap: Datamap) {
    import ss.sqlContext.implicits._
    def run() {
      val split = {
        val sp = config.split.toDouble
        if (sp <= 0.0 || sp >= 1.0) {
          ScalaUtil.writeWarning(s"Split $config.split must be greater than 0.0 and less than 1.0. 0.8 will be used." )
          jobResults.setRC(baseResults.WARN)
          Array(0.8, 0.2)
        }
        else Array(sp, 1.0 - sp)
      }
      val vecs = VectorBuilder.buildTargetDataFrames(ss, model, df)
      var targNum = 0
      model.targets.foreach(t => {
        var targetResults = new Results()
        targetResults.put("target_name", t.getName())
        targetResults.put("target_type", t.getDatatype())
        targetResults.put("target_parms", ScalaUtil.makeParmString(t.getParms()))
        targetResults.addArray("algorithms")
        modelResults.put("targets", targetResults)
        val tVecs : Array[RDD[(String, LabeledPoint)]] = vecs(targNum).randomSplit(split)
        targNum += 1
        tVecs(0).cache()
        tVecs(1).cache
        t.algorithms.foreach(a => {
          a match {
            case None => ScalaUtil.writeError(s"Target ${t.getName()} algorithm ${a.get.name} encountered an error.")
            case Some(alg) => {
              alg.start()
              alg.train(tVecs(0).map(r => r._2))
              alg.test(tVecs(0), "training").get._1
              alg.test(tVecs(1), "holdback").get._1
              targetResults.put("algorithms", alg.end())
            }
          }
        })
      })
      model.saveModel()
    }
}