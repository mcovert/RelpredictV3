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

case class TrainingJob(jn: String, model: com.ai.relpredict.spark.Model, conf : Config, ss : SparkSession, df : DataFrame, dm: Datamap, jobParms : Map[String, String])
   extends Job(jn: String, model: Model, conf : Config, jobParms : Map[String, String]) {
    import ss.sqlContext.implicits._
    def run() : Results = {
      var r = new Results()
      val split = {
        if (conf.split <= 0.0 || conf.split >= 1.0) {
          ScalaUtil.writeWarning(s"Split $conf.split must be greater than 0.0 and less than 1.0. 0.8 will be used." )
          r.setRC(r.WARN)
          Array(0.8, 0.2)
        }
        else Array(conf.split, 1.0 - conf.split)
      }
      val vecs = VectorBuilder.buildTargetDataFrames(ss, model, df)
      var targnum = 0   
      model.targets.foreach(t => {
        val tVecs : Array[RDD[(String, LabeledPoint)]] = vecs(targnum).randomSplit(split)
        tVecs(0).cache()
        tVecs(1).cache
        t.algorithms.foreach(a => {
          // Train the model
          a.get.start()
          val rTrain = a.get.train(tVecs(0).map(r => r._2))
          val trainMsg = a.get.getTerminationStats(t.getName(), "train")
          ScalaUtil.controlMsg(trainMsg)
          r.addString(s"job.train_model.${model.name}.${t.getName()}.${a.get.name}.status.msg", trainMsg)
          r = r.merge(rTrain)
          // Test the training set
          a.get.start()
          val rTest0 = a.get.test(tVecs(0), "training")
          rTest0 match {
            case None => ScalaUtil.writeError(s"Target ${t.getName()} algorithm ${a.get.name} encountered an error.")
            case Some(x) => {
              val testMsg = a.get.getTerminationStats(t.getName(), "test training set")
              ScalaUtil.controlMsg(testMsg)
              r.addString(s"job.test_training_set.${model.name}.${t.getName()}.${a.get.name}.status.msg", testMsg)
              r = r.merge(x._1)
            }
          }
          // Test the hold back set
          a.get.start()
          val rTest = a.get.test(tVecs(1), "holdback")
          rTest match {
            case None => ScalaUtil.writeError(s"Target ${t.getName()} algorithm ${a.get.name} encountered an error.")
            case Some(x) => {
              val testholdMsg = a.get.getTerminationStats(t.getName(), "test holdback set")
              ScalaUtil.controlMsg(testholdMsg)
              r.addString(s"job.test_holdback_set.${model.name}.${t.getName()}.${a.get.name}.status.msg", testholdMsg)
              r = r.merge(x._1)
            }
          }
        })
        targnum += 1  
      })
      model.saveModel(jobID)
      r
    }
}