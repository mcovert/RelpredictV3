package com.ai.relpredict.spark

import com.ai.relpredict.spark._
import com.ai.relpredict.spark.algorithms._
import com.ai.relpredict.util._

/**
 * Produces Algorithms from a text string identifier. All newly defined Algorithms must be registered here.
 */
object AlgorithmFactory {
  def getAlgorithm(name : String, fs : FeatureSet, target : Target[_], parms : Map[String, String]) : Option[Algorithm] = {
    name match {
      case "dt"  => return Some(new DecisionTreeAlgorithm(fs, target, parms))
      case "rf"  => return Some(new RandomForestAlgorithm(fs, target, parms))
      case "gbt" => return Some(new GradientBoostedTreesAlgorithm(fs, target, parms))
      case "lsvm" => ScalaUtil.terminal_error(s"Algorithm $name was not found. Run termiinated.")
      case "lr"  => return Some(new LogisticRegressionAlgorithm(fs, target, parms))
      case "lir" => return Some(new LinearRegressionAlgorithm(fs, target, parms))
      case unknown => ScalaUtil.terminal_error(s"Algorithm $name was not found. Run terminated.")
    }
    None
  }
}