package org.apache.spark.mllib.linalg
//package com.ai.spark.encoders
// Note that 
import org.apache.spark._
import org.apache.spark.sql._
import com.ai.relpredict.spark._
import com.ai.relpredict.util._
import com.ai.relpredict.jobs.RPConfig
import org.apache.spark.mllib.feature.{Word2Vec, Word2VecModel}
import org.apache.spark.sql.{Row, DataFrame}
import scala.util.Try

// We will use the ml version of word2vec. When the resulting vector is encoded, it will be converted to mllib
// Vector format.
class w2v(name: String, ss: SparkSession) extends com.ai.relpredict.spark.RPEncoder[String](name, ss) {
	val model = Word2VecModel.load(ss.sparkContext, RPConfig.getEncoderModelDir() + name)

	def encode(sentence: String, dlm: String) : Vector = {
        val words = sentence.split(dlm)
        avgWordFeatures(wordFeatures(words))
	}
	// Strictly speaking, there is no decode function since encode is essentially a hash. Will need to account for this in 
	// some algorithm translations. May need to construct an inverse based on record id, or maybe do a join later to the
	// original record.
	def decode(v: Vector) : String = {""}
	def buildAndSaveModel(ss: SparkSession, df: DataFrame, colName: String, size: Int, dlm: String, fileName: String, overwrite: Boolean) {
        import ss.implicits._
		if (!SparkUtil.hdfsFileExists(fileName) || overwrite) {
           val word2vec = new Word2Vec()
           word2vec.fit(df.map(r => (r.getAs[String](colName)).split(dlm).toSeq).rdd).save(ss.sparkContext, fileName)
        }
		else ScalaUtil.writeError(s"Word2Vec model ${fileName} exists and overwrite was not specified. The model will not be saved.")
	}
    def wordFeatures(words: Iterable[String]): Iterable[Vector] = words.map(w => Try(model.transform(w))).filter(_.isSuccess).map(_.get)
    def avgWordFeatures(wordFeatures: Iterable[Vector]): Vector = Vectors.fromBreeze(wordFeatures.map(_.asBreeze).reduceLeft(_ + _) / wordFeatures.size.toDouble)
}
// package org.apache.spark.mllib.linalg

// import org.apache.spark.mllib.classification.SVMWithSGD
// import org.apache.spark.mllib.regression.LabeledPoint
// import org.apache.spark.rdd.RDD
// import org.apache.spark.{SparkContext, SparkConf}
// import org.apache.log4j.{Level, Logger}
// import org.apache.spark.mllib.feature.Word2Vec
// import org.apache.spark.mllib.linalg.{Vector, Vectors}

// import scala.util.Try

// case class Sample(id: String, review: String, sentiment: Option[Int] = None)

// object Word2VecExample extends App {
//   Logger.getLogger("org").setLevel(Level.OFF)
//   Logger.getLogger("akka").setLevel(Level.OFF)

//   def printRDD(xs: RDD[_]) {
//     println("--------------------------")
//     xs take 5 foreach println
//     println("--------------------------")
//   }

//   val conf = new SparkConf(false).setMaster("local").setAppName("Word2Vec")
//   val sc = new SparkContext(conf)

//   // Load
//   val trainPath = s"data/labeledTrainData.tsv"
//   val testPath = s"data/testData.tsv"

//   // Load text
//   def skipHeaders(idx: Int, iter: Iterator[String]) = if (idx == 0) iter.drop(1) else iter

//   val trainFile = sc.textFile(trainPath) mapPartitionsWithIndex skipHeaders map (l => l.split("\t"))
//   val testFile = sc.textFile(testPath) mapPartitionsWithIndex skipHeaders map (l => l.split("\t"))

//   // To sample
//   def toSample(segments: Array[String]) = segments match {
//     case Array(id, sentiment, review) => Sample(id, review, Some(sentiment.toInt))
//     case Array(id, review) => Sample(id, review)
//   }

//   val trainSamples = trainFile map toSample
//   val testSamples = testFile map toSample

//   // Clean Html
//   def cleanHtml(str: String) = str.replaceAll( """<(?!\/?a(?=>|\s.*>))\/?.*?>""", "")

//   def cleanSampleHtml(sample: Sample) = sample copy (review = cleanHtml(sample.review))

//   val cleanTrainSamples = trainSamples map cleanSampleHtml
//   val cleanTestSamples = testSamples map cleanSampleHtml

//   // Words only
//   def cleanWord(str: String) = str.split(" ").map(_.trim.toLowerCase).filter(_.size > 0).map(_.replaceAll("\\W", "")).reduce((x, y) => s"$x $y")

//   def wordOnlySample(sample: Sample) = sample copy (review = cleanWord(sample.review))

//   val wordOnlyTrainSample = cleanTrainSamples map wordOnlySample
//   val wordOnlyTestSample = cleanTestSamples map wordOnlySample

//   // Word2Vec
//   val samplePairs = wordOnlyTrainSample.map(s => s.id -> s).cache()
//   val reviewWordsPairs: RDD[(String, Iterable[String])] = samplePairs.mapValues(_.review.split(" ").toIterable)
//   println("Start Training Word2Vec --->")
//   val word2vecModel = new Word2Vec().fit(reviewWordsPairs.values)

//   println("Finished Training")
//   println(word2vecModel.transform("london"))
//   println(word2vecModel.findSynonyms("london", 4))

//   def wordFeatures(words: Iterable[String]): Iterable[Vector] = words.map(w => Try(word2vecModel.transform(w))).filter(_.isSuccess).map(_.get)

//   def avgWordFeatures(wordFeatures: Iterable[Vector]): Vector = Vectors.fromBreeze(wordFeatures.map(_.toBreeze).reduceLeft(_ + _) / wordFeatures.size.toDouble)

//   // Create a feature vectors
//   val wordFeaturePair = reviewWordsPairs mapValues wordFeatures
//   val avgWordFeaturesPair = wordFeaturePair mapValues avgWordFeatures
//   val featuresPair = avgWordFeaturesPair join samplePairs mapValues {
//     case (features, Sample(id, review, sentiment)) => LabeledPoint(sentiment.get.toDouble, features)
//   }
//   val trainingSet = featuresPair.values

//   // Classification
//   println("String Learning and evaluating models")
//   val Array(x_train, x_test) = trainingSet.randomSplit(Array(0.7, 0.3))
//   val model = SVMWithSGD.train(x_train, 100)

//   val result = model.predict(x_test.map(_.features))

//   println(s"10 samples:")
//   x_test.map { case LabeledPoint(label, features) => s"$label -> ${model.predict(features)}" } take 10 foreach println
//   val accuracy = x_test.filter(x => x.label == model.predict(x.features)).count.toFloat / x_test.count
//   println(s"Model Accuracy: $accuracy")

//   println("<---- done")
//   Thread.sleep(10000)
// }