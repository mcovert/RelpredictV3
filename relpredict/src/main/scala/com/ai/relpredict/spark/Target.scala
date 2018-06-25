package com.ai.relpredict.spark

import com.ai.relpredict.dsl._
import com.ai.relpredict.util._
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import com.ai.relpredict.jobs.RelPredict

/**
 * A Target represents a variable to be predicted. It is typed. A Target is mapped to a column, which by default is the same as its name. A Target (and all of its 
 * specified Algorithms) is assigned to a FeatureSet. If multiple algorithms that use different encodings are to be used on a single target, 
 * this can be accomplished by duplicating the target (and giving it a different name), assigning each to its required FeatureSet, and then mapping each Target to the
 * same DataFrame column (using a column map). String Targets can also use Data maps to translate their values. 
 */
abstract class Target[A](name : String, desc : String, algorithmDefs : Array[AlgorithmDef],  
                        fs : FeatureSet, columnMap : Datamap, parms : Map[String, String]) extends Serializable {
  val algorithms = algorithmDefs.map(alg => AlgorithmFactory.getAlgorithm(alg.name, fs, this, alg.parms))
  val columnName : String = columnMap.getValue(name)
  val dataMap = RelPredict.getDataMap(name)
  val featureSet = fs
  def size() : Int 
  def decode(i : Int) : A  
  def decode(i : Long) : A  
  def decode(i : Double) : A  
  def encode(r : Row) : Double 
  def getName() = name
  def getParms() = parms
  def getFeatureSet() = featureSet
  def translate(in : String) : String = { 
    if (dataMap.isDefined) dataMap.get.getValue(in)
    else in
  }
  def getMap() : Option[Map[String, Int]]
  def getInvMap() : Map[Int, String]
  def getDatatype() = ""
}
/** 
 *  A StringTarget encodes a categorical set of strings 
 *  
 */
case class StringTarget(name : String, desc : String, algorithmDefs : Array[AlgorithmDef], map : Map[String, Int], invMap : Map[Int, String], fs : FeatureSet, 
                        columnMap : Datamap, parms : Map[String, String] ) extends Target[String](name, desc, algorithmDefs, fs, columnMap, parms) {
  override def size() = invMap.size
  override def decode(i : Int) : String = invMap(i)
  override def decode(i : Long) : String = invMap(i.toInt)
  override def decode(i : Double) : String = invMap(i.toInt)
  override def encode(r : Row) : Double = map(translate(r.getAs[String](columnName))).toDouble
  override def getDatatype() = "string"
  def getInvMap() = invMap
  def getMap() = Some(map)  
}
/** 
 *  A BooleanTarget encodes either true or false 
 */
case class BooleanTarget(name : String, desc : String, algorithmDefs : Array[AlgorithmDef], fs : FeatureSet, columnMap : Datamap, 
                         parms : Map[String, String] ) extends Target[Boolean](name, desc, algorithmDefs, fs, columnMap, parms) {
  val invMap = Map[Int, String](0 -> "false", 1 -> "true")
  override def size() = 0
  override def decode(i : Int) : Boolean = { if (i == 0) false else true}
  override def decode(i : Long) : Boolean = { if (i == 0) false else true}
  override def decode(i : Double) : Boolean = { if (i == 0.0) false else true}
  override def encode(r : Row) : Double = if (r.getAs[Boolean](columnName)) 1.0 else 0.0
  override def getDatatype() = "boolean"
  def getInvMap() = invMap
  def getMap() = None
}
/** 
 *  An IntegerTarget encodes a categorical set of integers. Integers are represented as a Long to handle short, int, and bigint. 
 */
case class IntegerTarget(name : String, desc : String, algorithmDefs : Array[AlgorithmDef], fs : FeatureSet, columnMap : Datamap, 
                         parms : Map[String, String] ) extends Target[Long](name, desc, algorithmDefs, fs, columnMap, parms) {
  val invMap = Map[Int, String]()
  override def size() = 0
  override def decode(i : Int) : Long = i.toLong
  override def decode(i : Long) : Long = i
  override def decode(i : Double) : Long = i.toLong
  override def encode(r : Row) : Double = r.getAs[Integer](columnName).toDouble
  override def getDatatype() = "integer"
  def getInvMap() = invMap
  def getMap() = None
}
/** 
 *  A DoubleTarget encodes a categorical set of doubles 
 */
case class DoubleTarget(name : String, desc : String, algorithmDefs : Array[AlgorithmDef], fs : FeatureSet, columnMap : Datamap, 
                         parms : Map[String, String] ) extends Target[Double](name, desc, algorithmDefs, fs, columnMap, parms) {
  val invMap = Map[Int, String]()
  override def size() = 0
  override def decode(i : Int) : Double = i.toDouble
  override def decode(i : Long) : Double = i.toDouble
  override def decode(i : Double) : Double = i
  override def encode(r : Row) : Double = r.getAs[Double](columnName)
  override def getDatatype() = "double"
  def getInvMap() = invMap
  def getMap() = None
}