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
import org.apache.spark.mllib.classification._
import org.apache.spark.mllib.util.MLUtils
import org.apache.spark.rdd._
import com.ai.relpredict.util.ScalaUtil
import com.ai.relpredict.dsl._
import org.apache.spark.mllib.evaluation.MulticlassMetrics
/**
 * The decision tree is a greedy algorithm that performs a recursive binary partitioning of the feature space. The tree predicts the same label for each leaf partition. 
 * Each partition is chosen by selecting the best split from a set of possible splits maximizing the information gain at a tree node. 
 */
class LogisticRegressionAlgorithm(val fs : FeatureSet, target : Target[_], val parms : Map[String, String]) extends Algorithm("logistic_regression") {
  var lrmodel : Option[LogisticRegressionModel] = None
  var predicted : Option[RDD[(String, Double)]] = None
  val prefix = s"target.${target.getName()}.$name"
  /* Allows printing any model information to a file. For a Decision Tree, this is the actual tree if/then/else logic. */
  def printTo(file : FileWriter) {
    if (checkAlgorithmModel(lrmodel, false, "LogisticRegression - Print is not possible because no model exists")) {}
  }
  /** 
   *  Train an RDD of LabeledPoints
   */
  def train(df : RDD[LabeledPoint]) = {
    lrmodel match {
      case None =>
      case Some(m) => ScalaUtil.writeWarning("LogisticRegression - Overwriting existing trained model")
    }
    var results = new Results()
    // Set up all parameters
    var categoryMap = SparkUtil.buildCategoryMap(target.featureSet)
    val recLen = df.take(1)(0).features.size

    ScalaUtil.writeInfo(s"Logistic Regression training with (records=${df.count}, classes=${target.size}, features=$recLen)")
    // Train the model
    lrmodel = Some(new LogisticRegressionWithLBFGS().setNumClasses(target.size).run(df))
    checkAlgorithmModel(lrmodel, true, "LogisticRegression - training failed to produce a model")
    results.addDouble(s"${prefix}.training.records", df.count().toDouble)
    //results.addString(s"${prefix}.training.weights", lrmodel.get.weights.toString())
    //results.addString(s"${prefix}.training.intercept", lrmodel.get.intercept.toString())
    results
  }
  /** 
   *  Test an RDD of LabeledPoints against a trained model 
   */
  def test(df : RDD[(String, LabeledPoint)], suffix : String) : Option[(Results, RDD[(String, Double, Double)])] = { 
    checkAlgorithmModel(lrmodel, true, "LogisticRegression - test cannot be performed because no model exists")
    var results = new Results()
    results.addDouble(s"${prefix}.test.${suffix}.records", df.count())
    lrmodel match {
      case None => None
      case Some(m) => {
         val resultdf = df.map( { 
               case (id, point) => {
                   val prediction = m.predict(point.features)
                   (id, point.label, prediction) 
               }}
         )
         val testErr = AlgorithmUtil.getError(resultdf)
         results.addDouble(s"${prefix}.test.${suffix}.error", testErr)
         var matrix = AlgorithmUtil.getConfusionMatrix(resultdf, target)
         if (ScalaUtil.verbose) {
           ScalaUtil.controlMsg(s"Test error=$testErr")
           ScalaUtil.controlMsg(AlgorithmUtil.confusionToString(matrix, target.getInvMap(), "\n"))
         }
         results.addString(s"${prefix}.test.${suffix}.confusion", AlgorithmUtil.confusionToResultString(matrix, target.getInvMap()))
         val metrics = new MulticlassMetrics(resultdf.map(x => (x._3, x._2)))
         results.addDouble(s"${prefix}.test.${suffix}.accuracy", metrics.accuracy)
         target.getInvMap().map{ case (k, v) =>
           val rKey = s"${prefix}.test.${suffix}.label.$v"
           results.addDouble(s"$rKey.false_positive_rate", metrics.falsePositiveRate(k))
           results.addDouble(s"$rKey.true_positive_rate", metrics.truePositiveRate(k))
           results.addDouble(s"$rKey.precision", metrics.precision(k))
           results.addDouble(s"$rKey.recall", metrics.recall(k))
           results.addDouble(s"$rKey.f_measure", metrics.fMeasure(k))
         }
         Some((results, resultdf))
      }
    }
  }
  /** 
   *  Make predictions of an unlabeled Vector using a trained model. Save the result file to disk. The input RDD 
   *  consists of a string identifier that identifies the row and a vector of doubles that is used to make the 
   *  prediction. The output file (the results of the prediction) consists of rows containing the row identifier 
   *  and a double of the class that the row was predicted to be.
   */
  def predict(df : RDD[(String, Vector)]) : Option[(Results, RDD[(String, Double)])] = { 
    checkAlgorithmModel(lrmodel, true, "LogisticRegression - prediction is not possible because no model has been created")
    val r = new Results()
    val dfr = df.map(point => {
       val prediction = lrmodel.get.predict(point._2)
       (point._1, prediction)
    })
    Some((r, dfr))
  }
  /** 
   *  Save the model file to disk 
   */
  def saveModel(ss : SparkSession, fileName : String) {
    if (checkAlgorithmModel(lrmodel, false, "LogisticRegression - no model has been created. Save is ignored."))
       lrmodel.get.save(ss.sparkContext, fileName)
  }
  /**
   * Load the model from disk
   */
  def loadModel(ss: SparkSession, fileName : String) {
    lrmodel = Some(LogisticRegressionModel.load(ss.sparkContext, fileName))
    checkAlgorithmModel(lrmodel, true, "LogisticRegression - the model could not be loaded.")
  }
}