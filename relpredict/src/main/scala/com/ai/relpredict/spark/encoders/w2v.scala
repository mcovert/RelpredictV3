package com.ai.spark.encoders

import org.apache.spark.SparkSession
import com.ai.spark._
import org.apache.spark.ml.feature.Word2Vec
import org.apache.spark.ml.linalg.Vector
import org.apache.spark.sql.{Row, DataFrame}

class w2v extends RPEncoder[String] {
	var model: Option[Word2Vec] = None
    var words: Option[DataFrame] = None

	def encode(value: String) : Vector = {
		case Some(wdf: DataFrame) => wdf.filter($"wordvec" === value) 
	}
	def buildModel(df: DataFrame, colName: String, size: Int) {
        val word2vec = new Word2vec()
            .setInputCol(colName)
            .setOutputCol("wordvec")
            .setVectorSize(size)
            .setMinCount(0)
        model = Some(word2vec.fit(df))
        words = Some(model.transform(df)) 
	}
	def decode(v: Vector) : A
	def saveModel(fileName: String)

}