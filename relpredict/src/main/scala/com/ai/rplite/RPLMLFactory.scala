package com.ai.rplite

import scala.collection.mutable.ArrayBuffer
import scala.collection.mutable.Map
import com.ai.relpredict.util.ScalaUtil
import org.apache.spark.ml._
import org.apache.spark.sql.{SparkSession, DataFrame}
import org.apache.spark.ml.feature._

case class EstimatorWrapper(val algorithm_name: String) 
abstract class RPTransformer[A](val name: String) {
	val transformer : A
	def preload(parm: String)
	def fit()
	def print() {
        println(s"Transformer: $name")
	}
	def getTransformer() = transformer
}

object RPLMLFactory {
	def createTransformer(name: String, dataType: String, parms: String) : Transformer = {
		dataType match {
			case "text"    => createTextTransformer(name,    parms)
			case "string"  => createStringTransformer(name,  parms)
			case "double"  => createNumericTransformer(name, parms)
			case "integer" => createNumericTransformer(name, parms) 
			case "boolean" => createBooleanTransformer(name, parms) 
			case "date"    => createdateTransformer(name,    parms) 
		}
	}
	def createEstimator(target: RPLTarget, alg: RPLAlgorithm) : Estimator = {
		val estimator = alg.alg_name match {
	       case "dt"  | "decision_tree" => {}
	       case "rf"  | "random_forest" => {}
	       case "gbt" | "gradient_boosted_trees" => {}
	       case "svm" | "support_vector_machine" => {}
	       case "nb"  | "naive_bayes" => {}
	       case "nn"  | "neural_network" => {}
	       case "lr"  | "logisitic_regression" => {}
	       case _ => ScalaUtil.terminal_error(s"The algorithm ${alg.alg_name} is unknown. This error is terminal.") 
		}
		estimator
	}
	def createTextTransformer(name: String, parms: Map[String, String]) = {
		val encType = parms.getParm("encode")
		val transformer = encType match {
			case "multi-hot" => 
			case "w2v"       =>
			case _           => ScalaUtil.terminal_error(s"Unknown encoding for TEXT $name")
		}
		transformer
	}
	def createStringTransformer(name: String, parms: Map[String, String]) = {
		val encType = parms.getParm("encode")
		val transformer = encType match {
			case "category"  =>
			case "one-hot"   => 
			case "w2v"       =>
			case _           => ScalaUtil.terminal_error(s"Unknown encoding for TEXT $name")
		}
		transformer
	}
	def createNumericTransformer(name: String, parms: Map[String, String]) = {
		val transformer = encType match {
			case "minmax"  => new MixMaxScaler()
				                  .setInputCol(name)
				                  .setOutputCol(s"${name}_vector")
			case "bucket"  =>  {
				val splits = parms.getParm("buckets").split(",").map(v => v.toDouble)
				new Bucketizer().setInputCol(name)
				                .setOutputCol(s"${name}_vector")
				                .setSplits(splits)
			}
			case _         => ScalaUtil.terminal_error(s"Unknown encoding for numeric $name")
		}
		transformer
	}
	def createBooleanTransformer(name: String, parms: Map[String, String]) = {
	}
	def createDateTransformer(name: String, parms: Map[String, String]) = {
	}
}