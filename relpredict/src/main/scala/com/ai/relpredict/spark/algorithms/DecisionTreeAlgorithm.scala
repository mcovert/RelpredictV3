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
import org.apache.spark.mllib.tree.DecisionTree
import org.apache.spark.mllib.tree.model.DecisionTreeModel
import org.apache.spark.mllib.util.MLUtils
import org.apache.spark.rdd._
import com.ai.relpredict.util.{ScalaUtil, Results}
import com.ai.relpredict.dsl._

/**
 * The decision tree is a greedy algorithm that performs a recursive binary partitioning of the feature space. The tree predicts the same label for each leaf partition. 
 * Each partition is chosen by selecting the best split from a set of possible splits maximizing the information gain at a tree node. 
 */
class DecisionTreeAlgorithm(val fs : FeatureSet, target : Target[_], val parms : Map[String, String]) extends Algorithm("decision_tree") {
  var dtmodel : Option[DecisionTreeModel] = None
  var predicted : Option[RDD[(String, Double)]] = None
  /* Allows printing any model information to a file. For a Decision Tree, this is the actual tree if/then/else logic. */
  def printTo(file : FileWriter) {
    if (checkAlgorithmModel(dtmodel, false, "DecisionTree - Print is not possible because no model exists")) file.write(dtmodel.get.toDebugString)
  }
  /** 
   *  Train an RDD of LabeledPoints
   */
  def train(df : RDD[LabeledPoint]) = { 
    dtmodel match {
      case None =>
      case Some(m) => ScalaUtil.writeWarning("DecisionTree - Overwriting existing trained model")
    }
    var results = new Results()
    // Set up all parameters
    var categoryMap = SparkUtil.buildCategoryMap(target.featureSet)
    val impurity = ScalaUtil.getParm("impurity", "gini", parms)
    val maxDepth = ScalaUtil.getParm("depth", "5", parms).toInt
    val maxBins  = ScalaUtil.getParm("bins", "20000", parms).toInt
    val recLen = df.take(1)(0).features.size

    ScalaUtil.writeInfo(s"Decision tree training with (records=${df.count}, length=$recLen, impurity=$impurity, maxDepth=$maxDepth, maxBins=$maxBins)")
    // Train the model
    dtmodel = Some(DecisionTree.trainClassifier(df, target.size, categoryMap, impurity, maxDepth, maxBins))
    checkAlgorithmModel(dtmodel, true, "DecisionTree - training failed to produce a model")
    results.put("phase", "train")
    results.put("training_records", df.count().toDouble)
    results.put("decision_tree", AlgorithmUtil.getTreeModelText(dtmodel.get.toDebugString, target))
    results
  }
  /** 
   *  Test an RDD of LabeledPoints against a trained model 
   */
  def test(df : RDD[(String, LabeledPoint)], suffix : String) : Option[(Results, RDD[(String, Double, Double)])] = { 
    checkAlgorithmModel(dtmodel, true, "DecisionTree - test cannot be performed because no model exists")
    var results = new Results()
    results.put("phase", "test")
    results.put(s"test_${suffix}_records", df.count())
    dtmodel match {
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
  /** 
   *  Make predictions of an unlabeled Vector using a trained model. Save the result file to disk. The input RDD 
   *  consists of a string identifier that identifies the row and a vector of doubles that is used to make the 
   *  prediction. The output file (the results of the prediction) consists of rows containing the row identifier 
   *  and a double of the class that the row was predicted to be.
   */
  def predict(df : RDD[(String, Vector)]) : Option[(Results, RDD[(String, Double)])] = { 
    checkAlgorithmModel(dtmodel, true, "DecisionTree - prediction is not possible because no model has been created")
    val results = new Results()
    results.put("phase", "predict")
    results.put("predict_records", df.count())
    val dfr = df.map(point => {
       val prediction = dtmodel.get.predict(point._2)
       (point._1, prediction)
    })
    Some((results, dfr))
  }
  /** 
   *  Save the model file to disk 
   */
  def saveModel(ss : SparkSession, fileName : String) {
    if (checkAlgorithmModel(dtmodel, false, "DecisionTree - no model has been created. Save is ignored."))
       dtmodel.get.save(ss.sparkContext, fileName)
       /* Now save the visualizable decision tree to disk */
       //val sb = new StringBuilder()
       //sb.append(DecisionTreeUtil.getCSVHeader(dtmodel.get.depth))
       //sb.append(DecisionTreeUtil.getModelText(dtmodel.get.toDebugString, fs))
       //var file = SparkUtil.getHDFSFileWriter(s"${fileName}.vmodel", ss, false)
       //file.get.write(sb.toString())
       //file.get.close()
  }
  /**
   * Load the model from disk
   */
  def loadModel(ss: SparkSession, fileName : String) {
    dtmodel = Some(DecisionTreeModel.load(ss.sparkContext, fileName))
    checkAlgorithmModel(dtmodel, true, "DecisionTree - the model could not be loaded.")
  }
}