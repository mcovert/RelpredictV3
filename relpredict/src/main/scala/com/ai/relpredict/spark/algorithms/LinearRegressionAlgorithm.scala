package com.ai.relpredict.spark.algorithms

import com.ai.relpredict.spark._
import java.io.FileWriter
import org.apache.spark.SparkContext
import org.apache.spark.sql.{SparkSession, SQLContext, DataFrame}
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.sql.functions._
import org.apache.spark.mllib.linalg.{Vector, Vectors}
import org.apache.spark.mllib.regression.LabeledPoint
import org.apache.spark.mllib.util.MLUtils
import org.apache.spark.rdd._
import com.ai.relpredict.util.{ScalaUtil, Results}
import com.ai.relpredict.dsl._
import org.apache.spark.mllib.linalg.Vectors
import org.apache.spark.mllib.regression.LabeledPoint
import org.apache.spark.mllib.regression.LinearRegressionModel
import org.apache.spark.mllib.regression.LinearRegressionWithSGD;
import org.apache.spark.mllib.evaluation.MulticlassMetrics;
import com.ai.relpredict.{RelPredictUtil, PredictedRecord, PredictedRecords}

/* Victoria's first commit */

/**
 * 
 */
class LinearRegressionAlgorithm(val fs : FeatureSet, target : Target[_], val parms : Map[String, String]) extends Algorithm("linear_regression") { 
  var lirmodel : Option[LinearRegressionModel] = None
  var predicted : Option[RDD[(String, Double)]] = None
  
  /* Allows printing any model information to a file. For a Decision Tree, this is the actual tree if/then/else logic. */
  def printTo(file : FileWriter) {
    if (checkAlgorithmModel(lirmodel, false, "DecisionTree - Print is not possible because no model exists")) {
      file.write("intercept=" + lirmodel.get.intercept.toString)
      file.write("coeffs=" + lirmodel.get.weights.toString)
    }
  }
  /** 
   *  Train an RDD of LabeledPoints
   */
  def train(df : RDD[LabeledPoint]) = {
    lirmodel match {
      case None =>
      case Some(m) => ScalaUtil.writeWarning("LinearRegression - Overwriting existing trained model")
    }
    var phaseResults = setupPhase("test", "", s"${df.count()}")
        // Set up all parameters
    var categoryMap = SparkUtil.buildCategoryMap(target.featureSet)
    val recLen = df.take(1)(0).features.size
    val iters = 10000
    val stepSize = 0.00000001

    ScalaUtil.writeInfo(s"Linear Regression training with (records=${df.count}, features=$recLen)")
    // Train the model
    lirmodel = Some(LinearRegressionWithSGD.train(df, iters, stepSize))
    checkAlgorithmModel(lirmodel, true, "LinearRegression - training failed to produce a model")
    results.put("training_records", df.count().toDouble)
    results.put("training_weights", lirmodel.get.weights.toString())
    results.put("training_intercept", lirmodel.get.intercept.toString())
    results
  }
  /** 
   *  Test an RDD of LabeledPoints against a trained model 
   */
  def test(df : RDD[(String, LabeledPoint)], suffix : String) : Option[(Results, RDD[(String, Double, Double)])] = { 
    checkAlgorithmModel(lirmodel, true, "LinearRegression - test cannot be performed because no model exists")
    var phaseResults = setupPhase("test", suffix, s"${df.count()}")
    lirmodel match {
      case None => None
      case Some(m) => {
         val resultdf = df.map( { 
               case (id, point) => {
                   val prediction = m.predict(point.features)
                   (id, point.label, prediction) 
               }}
         )
         val testErr = AlgorithmUtil.getError(resultdf)
         phaseResults.put("error", s"$testErr")
         var matrix = AlgorithmUtil.getConfusionMatrix(resultdf, target)
         if (ScalaUtil.verbose) {
           ScalaUtil.controlMsg(s"Test error=$testErr")
           ScalaUtil.controlMsg(AlgorithmUtil.confusionToString(matrix, target.getInvMap(), "\n"))
         }
         phaseResults.put(s"test_${suffix}_confusion", AlgorithmUtil.confusionToResultString(matrix, target.getInvMap()))
         val metrics = new MulticlassMetrics(resultdf.map(x => (x._3, x._2)))
         phaseResults.put("accuracy", metrics.accuracy)
         target.getInvMap().map{ case (k, v) =>
           val rKey = s"test_${suffix}_label.$v"
           phaseResults.put(s"${rKey}_false_positive_rate", metrics.falsePositiveRate(k))
           phaseResults.put(s"${rKey}_true_positive_rate", metrics.truePositiveRate(k))
           phaseResults.put(s"${rKey}_precision", metrics.precision(k))
           phaseResults.put(s"${rKey}_recall", metrics.recall(k))
           phaseResults.put(s"${rKey}_f_measure", metrics.fMeasure(k))
         }
         Some((phaseResults, resultdf))
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
    checkAlgorithmModel(lirmodel, true, "LinearRegression - prediction is not possible because no model has been created")
    var phaseResults = setupPhase("predict", "", s"${df.count()}")
    val dfr = df.map(point => {
       val prediction = lirmodel.get.predict(point._2)
       (point._1, prediction)
    })
    Some((phaseResults, dfr))
  }
  /* Make a prediction based on a single record. The record consists of a string ID and a Vector of doubles. */
  def predictOne(point: (String, Vector)) : (String, Double) = {
       val prediction = lirmodel.get.predict(point._2)
       (point._1, prediction)    
  }
  /** 
   *  Save the model file to disk 
   */
  def saveModel(ss : SparkSession, fileName : String) {
    if (checkAlgorithmModel(lirmodel, false, "LinearRegression - no model has been created. Save is ignored."))
       lirmodel.get.save(ss.sparkContext, fileName)
  }
  /**
   * Load the model from disk
   */
  def loadModel(ss: SparkSession, fileName : String) {
    lirmodel = Some(LinearRegressionModel.load(ss.sparkContext, fileName))
    checkAlgorithmModel(lirmodel, true, "LinearRegression - the model could not be loaded.")
  }
 }
