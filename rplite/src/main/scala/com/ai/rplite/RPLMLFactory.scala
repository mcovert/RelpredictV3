package com.ai.rplite

import scala.collection.mutable.ArrayBuffer
import scala.collection.mutable.Map
import org.apache.spark.ml._
import org.apache.spark.sql.{SparkSession, DataFrame}
import org.apache.spark.ml.feature._

/*
 *    Encoders and decoders
 *
 *    Data Type         Encode method         Vector Size   Class
 *    =========         =============         ===========   =====
 *    Text              multi-hot             #classes      
 *                      w2v                   w2v window
 *    String            category              1
 *                      one-hot               #classes
 *                      w2v                   w2v window
 *    Double            normalize             1
 *                      bucket                1
 *    Integer           bucket                1
 *    Boolean           *none*                1
 *    Date              bucket                1
 *                      
 */
class RPLCodec(encoder: PipelineStage, decoder: PipelineStage) 

object RPLMLFactory {
	def createPipelineStage(mc: ModelColumn) : Option[RPLCodec] = {
		(mc.col_type, mc.parms.getOrElse("ENCODER", "")) match {
			case ("text", "multi-hot")                      => createTextMultiHotEncoder(mc)
			case ("text", "w2v")                            => createTextWord2VecEncoder(mc)
			case ("string", "category")                     => createStringCategoryEncoder(mc)
			case ("string", "one-hot")                      => createStringOneHotEncoder(mc)
			case ("string", "w2v")                          => createStringWord2VecEncoder(mc)
			case ("double", "normalize")                    => createNumericBucketEncoder(mc)
			case ("double" | "integer" | "date", "bucket")  => createNumericBucketEncoder(mc)
			case ( _ , "")                                  => None     /* No encoder will be used */
		}
	}
	def createPipelineStage(target: RPLTarget, alg: RPLAlgorithm) : Option[RPLCodec] = {
		val estimator = alg.alg_name match {
	       case "dt"  | "decision_tree"          => createDecisionTree(alg.parms)
	       case "rf"  | "random_forest"          => createRandomForest(alg.parms)
	       case "gbt" | "gradient_boosted_trees" => createGBTree(alg.parms)
	       case "svm" | "support_vector_machine" => createSVM(alg.parms)
	       case "nb"  | "naive_bayes"            => createNB(alg.parms)
	       case "nn"  | "neural_network"         => createNN(alg.parms)
	       case "lr"  | "logisitic_regression"   => createLogReg(alg.parms)
	       case _ => { println(s"The algorithm ${alg.alg_name} is unknown. It is ignored."); None } 
		}
		estimator
	}
	def createTextMultiHotEncoder(mc: ModelColumn)   : Option[RPLCodec] = { None }
	def createTextWord2VecEncoder(mc: ModelColumn)   : Option[RPLCodec] = { None }
	def createStringCategoryEncoder(mc: ModelColumn) : Option[RPLCodec] = { None }
	def createStringOneHotEncoder(mc: ModelColumn)   : Option[RPLCodec] = { None }
	def createStringWord2VecEncoder(mc: ModelColumn) : Option[RPLCodec] = { None }
	def createNumericBucketEncoder(mc: ModelColumn)  : Option[RPLCodec] = { None }

	def createDecisionTree(parms: RPLParameters)     : Option[RPLCodec] = { None }
	def createRandomForest(parms: RPLParameters)     : Option[RPLCodec] = { None }
	def createGBTree(parms: RPLParameters)           : Option[RPLCodec] = { None }
	def createSVM(parms: RPLParameters)              : Option[RPLCodec] = { None }
	def createNB(parms: RPLParameters)               : Option[RPLCodec] = { None }
	def createNN(parms: RPLParameters)               : Option[RPLCodec] = { None }
	def createLogReg(parms: RPLParameters)           : Option[RPLCodec] = { None }
}