package com.ai.rplite

import scala.collection.mutable.ArrayBuffer
import scala.collection.mutable.Map
import org.apache.spark.ml._
import org.apache.spark.sql.{SparkSession, DataFrame}
import org.apache.spark.ml.feature._

/**
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
class RPLAlgModel(alg: RPLAlgorithm, target: RPLTarget, pStage: PipelineStage)

object RPLMLFactory {
	def createPipelineStage(name: String, dataType: String, encoder: String, parms: Map[String,String]) : Option[RPLCodec] = {
		(dataType, encoder) match {
			case ("text", "multi-hot")                      => createTextMultiHotEncoder(name,   parms)
			case ("text", "w2v")                            => createTextWord2VecEncoder(name,   parms)
			case ("string", "category")                     => createStringCategoryEncoder(name, parms)
			case ("string", "one-hot")                      => createStringOneHotEncoder(name,   parms)
			case ("string", "w2v")                          => createStringWord2VecEncoder(name, parms)
			case ("double", "normalize")                    => createNumericBucketEncoder(name,  parms)
			case ("double" | "integer" | "date", "bucket")  => createNumericBucketEncoder(name,  parms)
			case ( _ , "")                                  => None     /* No encoder will be used */
		}
	}
	def createPipelineStage(target: RPLTarget, alg: RPLAlgorithm) : Option[RPLAlgModel] = {
		val estimator = alg.alg_name match {
	       case "dt"  | "decision_tree"          => createDecisionTree(alg.parms)
	       case "rf"  | "random_forest"          => createRandomForest(alg.parms)
	       case "gbt" | "gradient_boosted_trees" => createGBTree(alg.parms)
	       case "svm" | "support_vector_machine" => createSVM(alg.parms)
	       case "nb"  | "naive_bayes"            => createSVM(alg.parms)
	       case "nn"  | "neural_network"         => createNN(alg.parms)
	       case "lr"  | "logisitic_regression"   => createLogReg(alg.parms)
	       case _ => { println(s"The algorithm ${alg.alg_name} is unknown. It is ignored."); None } 
		}
		estimator
	}
	def createTextMultiHotEncoder(name: String,   parms: Map[String,String]) : Option[RPLCodec] = { None }
	def createTextWord2vecEncoder(name: String,   parms: Map[String,String]) : Option[RPLCodec] = { None }
	def createStringCategoryEncoder(name: String, parms: Map[String,String]) : Option[RPLCodec] = { None }
	def createStringOneHotEncoder(name: String,   parms: Map[String,String]) : Option[RPLCodec] = { None }
	def createStringWord2VecEncoder(name: String, parms: Map[String,String]) : Option[RPLCodec] = { None }
	def createNumericBucketEncoder(name: String,  parms: Map[String,String]) : Option[RPLCodec] = { None }

	def createDecisionTree(parms: Map[String, String]) : Option[RPLAlgModel] = { None }
	def createRandomForest(parms: Map[String, String]) : Option[RPLAlgModel] = { None }
	def createGBTree(parms: Map[String, String])       : Option[RPLAlgModel] = { None }
	def createSVM(parms: Map[String, String])          : Option[RPLAlgModel] = { None }
	def createSVM(parms: Map[String, String])          : Option[RPLAlgModel] = { None }
	def createNN(parms: Map[String, String])           : Option[RPLAlgModel] = { None }
	def createLogReg(parms: Map[String, String])       : Option[RPLAlgModel] = { None }
}