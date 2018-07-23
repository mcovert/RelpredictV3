package com.ai.rplite

import scala.collection.mutable.ArrayBuffer
import scala.collection.mutable.Map
import com.ai.relpredict.util.ScalaUtil
import com.ai.relpredict.spark.Model
import com.ai.relpredict.dsl._
import org.apache.spark.sql.{SparkSession, DataFrame}

class RPLExec { 
  /**
   *  For each feuture type, build its encoder and chain it into the pipeline. Also add target processing
   *  which includes creating and haining the algorithms (estimators). Finall, add the result decoders.
   *
   *  text             - multi-hot encoded
   *  text_w2v         - word2vec encoded
   *  string           - one-hot encoded
   *  string_w2v       - word2vec encoded
   *  string_category  - category encoded
   *  double           - raw
   *  double_norm      - normalized [0.0 to 1.0]
   *  integer          - raw converted to Double
   *  boolean          - raw converted to [0.0, 1.0]
   *
   */
  def buildPipeline(config: RPLConfig, df: DataFrame, ss: SparkSession) {
  } 
  def run(run: Array[String]) {
    // Run each requested phase (job)
    run.foreach{ r => runJob(r)}
  }
  def runJob(name: String) {
    name match {
      case "predict" => predict()
      case "train"   => train()
      case "display" => display()
      case _         => ScalaUtil.writeError(s"Unknown run type is ignored: ${name}")
    }
  }
  def predict() {}
  def train() {}
  def display() {

  }
}