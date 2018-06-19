package com.ai.relpredict.spark

import com.ai.relpredict.dsl._
import com.ai.relpredict.jobs.Results
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.DataFrame
import org.apache.spark.mllib.linalg.{Vector, Vectors}
import org.apache.spark.mllib.regression.LabeledPoint
import org.apache.spark.rdd._
import com.ai.relpredict._
import com.ai.relpredict.spark._
import com.ai.relpredict.util.ScalaUtil
import java.io.FileWriter
import java.util.Date
/**
 * The Algorithm class is an abstract base class that is used as a wrapper for all algorithms. This is necessary because all Spark MLLib and ML algorithms
 * do not share a common ancestry.
 */
abstract class Algorithm(val name : String) extends Serializable {
  var starttime : Date = new Date()
  /** Print anything noteworthy to a file  */ 
  def printTo(file : FileWriter)
  /**  Train a model on a LabeledPoint (label : Double, featureVector : Vector) */
  def train(df : RDD[LabeledPoint]) : Results
  /**  Test a model using an identifier string and a LabeledPoint*/
  def test(df : RDD[(String, LabeledPoint)], suffix : String) : Option[(Results, RDD[TestedVector])]
  /**  Predict using an identifier string and a Vector*/
  def predict(df : RDD[(String, Vector)]) : Option[(Results, RDD[PredictedVector])] 
  /**  Persist the model*/
  def saveModel(ss : SparkSession, fileName : String)
  /**  Load a saved model*/
  def loadModel(ss : SparkSession, fileName : String)
  /**  A utility method to check whether a trained model exists, optionally terminating if not */
  def checkAlgorithmModel(aModel : Option[Any], terminate : Boolean, msg : String) : Boolean = {
    aModel match {
      case None => {       
        if (terminate) ScalaUtil.terminal_error(msg)
        else ScalaUtil.writeError(msg)
        false
      }
      case Some(m) => true
    }
  }
  def start() { starttime = ScalaUtil.getDate() }
  def end()  = (ScalaUtil.getDate().getTime - starttime.getTime).toDouble / 1000.0
}