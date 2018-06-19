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
import org.apache.spark.mllib.tree.RandomForest
import org.apache.spark.mllib.tree.model.RandomForestModel
import org.apache.spark.mllib.util.MLUtils
import org.apache.spark.rdd._
import com.ai.relpredict.util.{ScalaUtil, Results}
import com.ai.relpredict.dsl._

/**
 * Random forests train a set of decision trees separately, and the training is done in parallel. The algorithm creates randomness into the training process 
 * so that each decision tree is slightly different. Combining the predictions from each tree stabilizes the predictions, usually improving the accuracy of the model.
 */
class RandomForestAlgorithm(val fs : FeatureSet, target : Target[_], val parms : Map[String, String]) extends Algorithm("random_forest") {
  var rfmodel : Option[RandomForestModel] = None
  var predicted : Option[RDD[(String, Double)]] = None
  /* Allows printing any model information to a file. For a Decision Tree, this is the actual tree if/then/else logic. */
  def printTo(file : FileWriter) {
    if (checkAlgorithmModel(rfmodel, false, "RandomForest - Print is not possible because no model exists")) file.write(rfmodel.get.toDebugString)
  }
  /* Train an RDD of LabeledPoints */
  def train(df : RDD[LabeledPoint]) = {  
    rfmodel match {
      case None =>
      case Some(m) => ScalaUtil.writeWarning("RandomForest - Overwriting exisiting trained model")
    }
    var results = new Results()
    results.put("phase", "train")
    // Set up all parameters
    var categoryMap = SparkUtil.buildCategoryMap(target.featureSet)
    // Train the model
    val impurity = ScalaUtil.getParm("impurity", "gini", parms)
    val maxDepth = ScalaUtil.getParm("depth", "5", parms).toInt
    val maxBins  = ScalaUtil.getParm("bins", "20000", parms).toInt
    val numTrees = ScalaUtil.getParm("trees", "5", parms).toInt
    val recLen = df.take(1)(0).features.size
    val featureSubsetStrategy = ScalaUtil.getParm("strategy", "auto", parms)
    ScalaUtil.writeInfo(s"RandomForest training with (records=${df.count}, length=$recLen, impurity=$impurity, maxDepth=$maxDepth, maxBins=$maxBins, trees=$numTrees, strategy=$featureSubsetStrategy)")
    rfmodel = Some(RandomForest.trainClassifier(df, target.size, categoryMap, numTrees, featureSubsetStrategy, impurity, maxDepth, maxBins))
    checkAlgorithmModel(rfmodel, true, "RandomForest - training failed to produce a model")
    results.put(s"training_records", df.count().toDouble)
    results
  }
  /* Test an RDD of LabeledPoints against a trained model */
  def test(df : RDD[(String, LabeledPoint)], suffix : String) : Option[(Results, RDD[(String, Double, Double)])] = { 
    checkAlgorithmModel(rfmodel, true, "RandomForest - test cannot be performed because no model exists")
    var results = new Results()
    results.put("phase", "test")
    results.put(s"test_${suffix}_records", df.count())
    rfmodel match {
      case None => None
      case Some(m) => {
         val resultdf = df.map( { 
               case (id, point) => {
                   val prediction = m.predict(point.features)
                   (id, point.label, prediction) 
               }}
         )
         val testErr = AlgorithmUtil.getError(resultdf)
         results.put(s"test_${suffix}_error", testErr)
         var matrix = AlgorithmUtil.getConfusionMatrix(resultdf, target)
         if (ScalaUtil.verbose) {
           ScalaUtil.controlMsg(s"Test error=$testErr")
           ScalaUtil.controlMsg(AlgorithmUtil.confusionToString(matrix, target.getInvMap(), "\n"))
         }
         results.put(s"test_${suffix}_confusion", AlgorithmUtil.confusionToResultString(matrix, target.getInvMap()))         
         Some((results, resultdf))
      }
    }
  }
  /* Make predictions of an unlabeled Vector using a trained model. Save the result file to disk.    */
  /* The input RDD consists of a string identifier that identifies the row and a vector of doubles   */
  /* that is used to make the prediction. The output file (the results of the prediction) consists   */
  /* of rows containing the row identifier and a double of the class that the row was predicted to be. */
  def predict(df : RDD[(String, Vector)]) : Option[(Results, RDD[(String, Double)])] = { 
    checkAlgorithmModel(rfmodel, true, "RandomForest - prediction is not possible because no model has been created")
    val results = new Results()
    results.put("phase", "predict")
    results.put("predict_records", df.count())    
    val dfr = df.map(point => {
       val prediction = rfmodel.get.predict(point._2)
       (point._1, prediction)
    })
    Some((results, dfr))
  }
  /* Save the model file to disk */
  def saveModel(ss : SparkSession, fileName : String) {
    if (checkAlgorithmModel(rfmodel, false, "RandomForest - no model has been created. Save is ignored."))
       rfmodel.get.save(ss.sparkContext, fileName)
  }
  def loadModel(ss: SparkSession, fileName : String) {
    rfmodel = Some(RandomForestModel.load(ss.sparkContext, fileName))
    checkAlgorithmModel(rfmodel, true, "RandomForest - the model could not be loaded.")
  }
  def getTreeModelText() = rfmodel.get.toDebugString
}