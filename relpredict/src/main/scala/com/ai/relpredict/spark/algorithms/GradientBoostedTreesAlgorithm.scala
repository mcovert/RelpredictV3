package com.ai.relpredict.spark.algorithms

import com.ai.relpredict.jobs.Results
import com.ai.relpredict.spark._
import java.io.FileWriter
import org.apache.spark.SparkContext
import org.apache.spark.sql.{SparkSession, SQLContext, DataFrame}
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.sql.functions._
import org.apache.spark.mllib.linalg.{Vector, Vectors}
import org.apache.spark.mllib.regression.LabeledPoint
import org.apache.spark.mllib.tree.GradientBoostedTrees
import org.apache.spark.mllib.tree.configuration.BoostingStrategy
import org.apache.spark.mllib.tree.model.GradientBoostedTreesModel
import org.apache.spark.mllib.util.MLUtils

import org.apache.spark.rdd._
import com.ai.relpredict.util.ScalaUtil
import com.ai.relpredict.dsl._

/**
 * Gradient boosting iteratively trains a sequence of decision trees. On each iteration, the algorithm uses the current ensemble to predict the label of 
 * each training instance and then compares the prediction with the true label. The dataset is re-labeled to put more emphasis on training instances with 
 * poor predictions. Thus, in the next iteration, the decision tree will help correct for previous mistakes.
 */
class GradientBoostedTreesAlgorithm(val fs : FeatureSet, target : Target[_], val parms : Map[String, String]) extends Algorithm("gradient_boosted_trees") {
  var gbmodel : Option[GradientBoostedTreesModel] = None
  var predicted : Option[RDD[(String, Double)]] = None
  val prefix = s"target.${target.getName()}.$name"
  /* Allows printing any model information to a file. For a Decision Tree, this is the actual tree if/then/else logic. */
  def printTo(file : FileWriter) {
    if (checkAlgorithmModel(gbmodel, false, "GradientBoostedTrees - Print is not possible because no model exists")) file.write(gbmodel.get.toDebugString)
  }
  /* Train an RDD of LabeledPoints */
  def train(df : RDD[LabeledPoint]) = {  
    gbmodel match {
      case None =>
      case Some(m) => ScalaUtil.writeWarning("GradientBoostedTrees - Overwriting exisiting trained model")
    }
    var results = new Results()
    // Set up all parameters
    var categoryMap = SparkUtil.buildCategoryMap(target.featureSet)
    val recLen = df.take(1)(0).features.size
    // Train the model
    val boostingStrategy = BoostingStrategy.defaultParams("Classification")
    boostingStrategy.numIterations = ScalaUtil.getParm("iterations", "10", parms).toInt
    boostingStrategy.treeStrategy.numClasses = target.size
    boostingStrategy.treeStrategy.maxDepth = ScalaUtil.getParm("depth", "5", parms).toInt
    boostingStrategy.treeStrategy.categoricalFeaturesInfo = categoryMap
    ScalaUtil.writeInfo(s"Gradient boosted trees training with (records=${df.count} length=$recLen depth=${boostingStrategy.treeStrategy.maxDepth})")
    gbmodel = Some(GradientBoostedTrees.train(df, boostingStrategy))
    checkAlgorithmModel(gbmodel, true, "GradientBoostedTrees - training failed to produce a model")
    results.addDouble("$prefix.training.records", df.count().toDouble)
    results
  }
  /* Test an RDD of LabeledPoints against a trained model */
  def test(df : RDD[(String, LabeledPoint)], suffix : String) : Option[(Results, RDD[(String, Double, Double)])] = { 
    checkAlgorithmModel(gbmodel, true, "GradientBoostedTrees - test cannot be performed because no model exists")
    df.cache
    var results = new Results()
    results.addDouble("$prefix.test.records", df.count())
    gbmodel match {
      case None =>
      case Some(m) => {
         val resultdf = df.map { case (id, point) =>
            val prediction = m.predict(point.features)
            (id, point.label, prediction)
         }
         val testErr = AlgorithmUtil.getError(resultdf)
         results.addDouble(s"${prefix}.test.${suffix}.error", testErr)
         var matrix = AlgorithmUtil.getConfusionMatrix(resultdf, target)
         if (ScalaUtil.verbose) {
           ScalaUtil.controlMsg(s"Test error=$testErr")
           ScalaUtil.controlMsg(AlgorithmUtil.confusionToString(matrix, target.getInvMap(), "\n"))
         }
         results.addString(s"${prefix}.test.${suffix}.confusion", AlgorithmUtil.confusionToResultString(matrix, target.getInvMap()))
         df.unpersist()
         Some((results, resultdf))
      }
    }
    None
  }
  /* Make predictions of an unlabeled Vector using a trained model. Save the result file to disk.    */
  /* The input RDD consists of a string identifier that identifies the row and a vector of doubles   */
  /* that is used to make the prediction. The output file (the results of the prediction) consists   */
  /* of rows containing the row identifier and a double of the class that the row was predicted to be. */
  def predict(df : RDD[(String, Vector)]) : Option[(Results, RDD[(String, Double)])] = { 
    checkAlgorithmModel(gbmodel, true, "GradientBoostedTrees - prediction is not possible because no model has been created")
    val r = new Results()
    val dfr = df.map(point => {
       val prediction = gbmodel.get.predict(point._2)
       (point._1, prediction)
    })
    Some((r, dfr))
  }
  /* Save the model file to disk */
  def saveModel(ss : SparkSession, fileName : String) {
    if (checkAlgorithmModel(gbmodel, false, "GradientBoostedTrees - no model has been created. Save is ignored."))
       gbmodel.get.save(ss.sparkContext, fileName)
  }
  def loadModel(ss: SparkSession, fileName : String) {
    gbmodel = Some(GradientBoostedTreesModel.load(ss.sparkContext, fileName))
    checkAlgorithmModel(gbmodel, true, "GradientBoostedTrees - the model could not be loaded.")
  }
    def getTreeModelText() = gbmodel.get.toDebugString

}