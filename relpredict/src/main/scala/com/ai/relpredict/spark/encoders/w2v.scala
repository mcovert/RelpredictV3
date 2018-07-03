package com.ai.spark.encoders

import org.apache.spark.SparkSession

object w2v {
	def encode(values: Iterable[String]) = {
	   new Word2Vec().fit(values)
	}
}