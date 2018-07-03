package com.ai.relpredict.spark

import com.ai.relpredict.dsl._
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.DataFrame
import org.apache.spark.mllib.linalg.{Vector, Vectors}
import org.apache.spark.mllib.regression.LabeledPoint
import org.apache.spark.rdd._
import com.ai.relpredict._
import com.ai.relpredict.spark._
import com.ai.relpredict.util.{ScalaUtil, Results}
import java.io.FileWriter
import java.util.Date
/**
 * The Algorithm class is an abstract base class that is used as a wrapper for all algorithms. This is necessary because all Spark MLLib and ML algorithms
 * do not share a common ancestry.
 */
abstract class Algorithm(val name : String) extends Serializable {
  var results = new Results()
  var phaseResults = new Results()
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
  def getProbability(pred: Double) : Double = 0.0
  def start() { 
    starttime = ScalaUtil.getDate()
    results = new Results()
    results.put("alg_name", name)
    results.put("start_time", starttime.toString()) 
    results.addArray("phases")

  }
  def runTime()  = (ScalaUtil.getDate().getTime - starttime.getTime).toDouble / 1000.0
  def end() : Results = {
    val endtime = new Date()
    results.put("end_time", endtime.toString())
    results.put("run_time", (endtime.getTime - starttime.getTime).toDouble / 1000.0)
    results
  }
  def setupPhase(phaseName: String, stepName: String, recCount: String) : Results = {
    phaseResults = new Results()
    phaseResults.put("phase", phaseName)
    phaseResults.put("step", stepName)
    phaseResults.addArray("metrics")
    results.put("phases", phaseResults)
    if (!recCount.isEmpty()) phaseResults.put("records", recCount)
    phaseResults
  }
  def addMetric(metricName: String, metricValue: Any, related: String) {
    var metricResults = new Results()
    metricResults.put("metric_name", metricName)
    metricResults.put("metric_value", metricValue)
    metricResults.put("related", related)
    phaseResults.put("phases", metricResults)
  }
}