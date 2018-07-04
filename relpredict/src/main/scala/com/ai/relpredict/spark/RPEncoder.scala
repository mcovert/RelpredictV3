package com.ai.spark

abstract class RPEncoder[A] {
	def encode(value: A) : Vector
	def buildModel(df: DataFrame, colName: String, size: Int)
	def decode(v: Vector) : A
	def saveModel(fileName: String)
}
