package com.ai.relpredict.jobs

import com.ai.relpredict.spark._
import org.apache.spark.sql.SparkSession
import org.apache.spark.rdd.RDD
import org.apache.spark.mllib.linalg.{Vector, Vectors}
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.mllib.regression.LabeledPoint
import org.apache.spark.mllib.tree.model.{DecisionTreeModel, Node}
import com.ai.relpredict.util.{ScalaUtil, Datamap}
import com.ai.relpredict.spark.{VectorBuilder, SparkUtil, Target, AlgorithmFactory, Model}
import org.apache.spark.sql.catalyst.encoders.RowEncoder
import org.apache.spark.sql.Row
import scala.collection.mutable.ArrayBuffer


case class TrainingJob(jn: String, model: com.ai.relpredict.spark.Model, conf : Config, ss : SparkSession, df : DataFrame, dm: Datamap, jobParms : Map[String, String])
   extends Job(jn: String, model: Model, conf : Config, jobParms : Map[String, String]) {
    import ss.sqlContext.implicits._
    def run() : Map[String, Any] = {
      val split = {
        val sp = conf.split.toDouble
        if (sp <= 0.0 || sp >= 1.0) {
          ScalaUtil.writeWarning(s"Split $conf.split must be greater than 0.0 and less than 1.0. 0.8 will be used." )
          jobResults.setRC(r.WARN)
          Array(0.8, 0.2)
        }
        else Array(sp, 1.0 - sp)
      }
      val vecs = VectorBuilder.buildTargetDataFrames(ss, model, df)
      var targetResults = new scala.collection.mutable.ArrayBuffer.empty[Results]
      model.targets.foreach(t => {
        var tResults = new Results()
        targetResults += tResults
        tResults.add("target_name", t.getName())
        var tAlgResults = new scala.collection.mutable.ArrayBuffer.empty[Results]
        tResults.add("algorithms", tAlgResults)
        val tVecs : Array[RDD[(String, LabeledPoint)]] = vecs(targnum).randomSplit(split)
        tVecs(0).cache()
        tVecs(1).cache
        t.algorithms.foreach(a => {
          a match {
            case None => ScalaUtil.writeError(s"Target ${t.getName()} algorithm ${a.get.name} encountered an error.")
            case Some(alg) => {
              alg.start()
              alg.train(tVecs(0).map(r => r._2))
              alg.test(tVecs(0), "training")
              alg.test(tVecs(1), "holdback")
              tAlgResults += alg.end()
            }

          }
        })
      })
      model.saveModel(jobID)
      r
    }
}