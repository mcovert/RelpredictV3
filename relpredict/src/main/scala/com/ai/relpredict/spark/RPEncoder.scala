package com.ai.spark

import org.apache.spark.mllib.linalg.{Vector, Vectors}
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.mllib.regression.LabeledPoint
import scala.collection.mutable.ArrayBuilder
import com.ai.relpredict.util._
import com.ai.relpredict.spark._
import org.apache.spark.rdd._
import com.ai.relpredict._

abstract class RPEncoder[A] {
	def encode(value: A) : Vector
	def buildModel(df: DataFrame, colName: String, size: Int)
	def decode(v: Vector) : A
	def saveModel(fileName: String)
}
