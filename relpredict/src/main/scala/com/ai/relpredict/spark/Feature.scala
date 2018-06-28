package com.ai.relpredict.spark

import org.apache.spark.sql.SparkSession
import org.apache.spark.rdd.RDD
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.mllib.linalg.{Vectors, Vector}
import com.ai.relpredict.util._
/* TO-DO: perform data mapping if specified */
import com.ai.relpredict.jobs.RelPredict
/** 
 *  A Feature is an abstract class representing a variable to be encoded and used for training and prediction. It is sub-typed through several
 *  case classes to provide functionality. A Feature is mapped by default to a column with its own name. A Feature can be mapped to a different 
 *  name using a column map. A Feature can be transformed using a Datamap.
 */
abstract class Feature[A](name : String, columnMap : Datamap) extends Serializable {
  val columnName : String = columnMap.getValue(name)
  val dataMap = RelPredict.getDataMap(name)
  var position = 0
  def getName() : String = name
  def getCount() : Int
  def getType()  : String
  def encode(r : Row) : Vector
  def decode(v : Vector) : A
  def decodeID(pos : Int) : String
  def getVectorLength() = 1
  def getMap() : Option[Map[String, Int]]
  def translate(in : String) : String = { 
    if (dataMap.isDefined) dataMap.get.getValue(in)
    else in
  }
  def setPosition(pos : Int) { position = pos }
  def getPosition() : Int = position
}
/**
 * A Null feature used generally when some sort of parse error has occurred.
 */
case class NullFeature() extends Feature[String]("", new Datamap("")) {
  def getCount() : Int = 0
  def getType()  : String = "null"
  def encode(r : Row) : Vector = Vectors.zeros(1)
  def decode(v : Vector) = ""
  def decodeID(pos : Int) = ""
  def getMap() = None
}
/** 
 *  A TextFeature is a multi-hot encoded string. It encodes a variable number of strings into a single field separated by a delimiter.
 *  
 */
case class TextFeature(name : String, desc : String, parms : Map[String, String], ss: SparkSession, 
                       map: Map[String, Int], column_map : Datamap) extends Feature[String](name, column_map) {
  import ss.sqlContext.implicits._
  val dlm = parms.get("dlm").getOrElse("comma") match {
       case "comma" => ","
       case "pipe" =>  "\\|"
       case "space" => " "
       case "semicolon" => ";"
       case unknown => { ScalaUtil.writeError(s"Unknown delimiter type $unknown. Using default.") ; "\\|" }
  }
  val invMap = SparkUtil.invertMap(map)
  def getCount() : Int = map.size
  def getType() : String = "text"
  override def getVectorLength() = map.size 
  def encode(r : Row) : Vector = {
    VectorBuilder.buildDenseVectorFromText(r.getAs[String](columnName), map, dlm, dataMap, name)
  }
  def decode(v : Vector) : String = VectorBuilder.decodeVectorToText(v, invMap, dlm)
  def decodeID(pos : Int) = if (pos >= 0 && pos < getCount()) s"$name=${invMap(pos)}" else s"$name"
  def getMap() = Some(map)
}
/** 
 *  A StringFeature is one hot encoded by single field set of strings. StringFeatures are generally used with algorithms that need some sort
 *  of "distance" calculation to determine similarity. 
 */
case class StringFeature(name : String, desc : String, parms : Map[String, String], ss: SparkSession, 
                         map: Map[String, Int], column_map : Datamap) extends Feature[String](name, column_map) {
  import ss.sqlContext.implicits._
  val invMap = SparkUtil.invertMap(map)
  /* We need to know how to encode this feature. A string can be one hot encoded or it can be category encoded. */
  /* One hot encoded features will appear as multiple binary categories (one for each position in the vector.   */
  /* Category encoded features will appear as a single category with a count equal to the number of values.     */
  val encStyle = ScalaUtil.getParm("encode", "ohc", parms)
  def getCount() : Int = map.size
  def getType() : String = "string"
  override def getVectorLength() = { if (encStyle == "ohc") map.size else 1 } 
  def encode(r : Row) : Vector = {
      VectorBuilder.buildDenseVectorFromString(translate(r.getAs[String](columnName)), map, name)
  }
  def decode(v : Vector) : String = VectorBuilder.decodeVectorToString(v, invMap)
  def decodeID(pos : Int) = if (pos >= 0 && pos < getCount()) s"$name=${invMap(pos)}" else s"$name"
  def getMap() = Some(map)
}
/** 
 *  A StringCategoryFeature is single column category encoded as one column with an ordinal value. StringCategoryFeatures are generally used with algorithms that 
 *  rely on grouping and counting rather than distance.  */
case class StringCategoryFeature(name : String, desc : String, parms : Map[String, String], ss: SparkSession, 
                                 map: Map[String, Int], column_map : Datamap) extends Feature[String](name, column_map) {
  import ss.sqlContext.implicits._
  var newStrings = scala.collection.mutable.HashSet[String]()
  val invMap = SparkUtil.invertMap(map)
  /* We need to know how to encode this feature. A string can be one hot encoded or it can be category encoded. */
  /* One hot encoded features will appear as multiple binary categories (one for each position in the vector.   */
  /* Category encoded features will appear as a single category with a count equal to the number of values.     */
  val encStyle = ScalaUtil.getParm("encode", "ohc", parms)
  def getCount() : Int = map.size
  def getType() : String = "string"
  override def getVectorLength() = { if (encStyle == "ohc") map.size else 1 } 
  def encode(r : Row) : Vector = {
      val s = translate(r.getAs[String](columnName))
      Vectors.dense(Array(ScalaUtil.getStringIndexFromMap(name, s, map).toDouble))
  }
  def decode(v : Vector) : String = {
    if (v.size != 1) ScalaUtil.writeError(s"Categorical String feature $name is not of length 1. Using first position.")
     invMap(v(0).toInt)
  } 
  def decodeID(pos : Int) = if (pos >= 0 && pos < getCount()) s"$name=${invMap(pos)}" else s"$name"
  def getMap() = Some(map)
}
/**
 * An IntegerFeature is represented by a set of Integers. They can be normalized through their encode parameter.
 * Integers are represented by a Long to cover short, int, and bigint data types.
 */
case class IntegerFeature(name : String, desc : String, parms : Map[String, String], ss: SparkSession, 
                          column_map : Datamap) extends Feature[Long](name, column_map) {
  import ss.sqlContext.implicits._
  def getCount() : Int = 0
  def getType() : String = "integer"
  def encode(r : Row) : Vector = {
     VectorBuilder.buildVector(r.getAs[Long](columnName))
  }
  def decode(v : Vector) : Long = {
    v(0).toLong
  }
  def decodeID(pos : Int) = s"$name"
  def getMap() = None
}
/**
 * A DoubleFeature is represented by a set of Doubles. They can be normalized through their encode parameter.
 */
case class DoubleFeature(name : String, desc : String, parms : Map[String, String],  ss: SparkSession, 
                         column_map : Datamap) extends Feature[Double](name, column_map) {
  import ss.sqlContext.implicits._
  def getCount() : Int = 0
  def getType() : String = "double"  
  def encode(r : Row) : Vector = {
     VectorBuilder.buildVector(r.getAs[Double](columnName))
  }
  def decode(v : Vector) : Double = {
    v(0)
  }
  def decodeID(pos : Int) = s"$name"
  def getMap() = None
}
/**
 * A BooleanFeature is represented by a simple Boolean variable.
 */
case class BooleanFeature(name : String, desc : String, parms : Map[String, String], ss: SparkSession, 
                          column_map : Datamap) extends Feature[Boolean](name, column_map) {
  import ss.sqlContext.implicits._
  def getCount() : Int = 2
  def getType() : String = "boolean"  
  def encode(r : Row) : Vector = {
     VectorBuilder.buildVector(r.getAs[Boolean](columnName))
  }
  def decode(v : Vector) : Boolean = {
    if (v(0) == 1.0) true else false
  }
  def decodeID(pos : Int) = s"$name"
  def getMap() = None
}