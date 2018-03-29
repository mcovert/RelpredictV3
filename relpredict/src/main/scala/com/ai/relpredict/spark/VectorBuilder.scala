package com.ai.relpredict.spark

import org.apache.spark.mllib.linalg.{Vector, Vectors}
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.mllib.regression.LabeledPoint
import scala.collection.mutable.ArrayBuilder
import com.ai.relpredict.util._
import com.ai.relpredict.spark._
import org.apache.spark.rdd._
import com.ai.relpredict._

/** 
 *  The VectorBuilder object contains encoder utilities for encoding and decoding machine learning vectors 
 */ 
object VectorBuilder {
  //var first = true
  /** 
   *  Build an array of data frames for train/test, one for each target. The DataFrame should be cached.
   *  TO-DO: Build these based on FeatureSets and map them back to targets!
   */ 
  def buildTargetDataFrames(ss : SparkSession, model : Model, df : DataFrame) : Array[RDD[(String, LabeledPoint)]] = {
    import ss.implicits._
    val adf = model.targets.map(t => { ScalaUtil.controlMsg(s"Processing target ${t.getName()} with feature set ${t.featureSet.name}"); df.map(r => buildTargetVector(t, r)).rdd})
    adf.toArray
  } 
  /** 
   *  Build the target Vector based on the assigned FeatureSet 
   */
  def buildTargetVector(target : Target[_], r : Row) : (String, LabeledPoint) = {
    val fv = assemble(target.getFeatureSet().features.map(f => f.encode(r)))
    (r.getAs[String](target.getFeatureSet().id), LabeledPoint(target.encode(r), fv))
  }
  /** 
   *  Build an array if data frames for prediction, one for each target. This optimizes data encoding by only passing 
   *  over the features once for each target. 
   */  
  def buildPredictionDataFrames(ss : SparkSession, model : Model, df : DataFrame) : Array[RDD[(String, Vector)]] = {
    import ss.implicits._
    val adf = Array[RDD[(String, Vector)]]()
    model.targets.foreach(t => adf :+ df.map(r => buildPredictionVector(t, r)))
    adf
  }
  /** 
   *  Build the target prediction Vector based on the assigned FeatureSet 
   */
  def buildPredictionVector(target : Target[_], r : Row) : (String, Vector) = {
    (r.getAs[String](target.getFeatureSet().id), assemble(target.getFeatureSet().features.map(f => f.encode(r))))
  }
  
  /** 
   *  Build a dense Vector from delimited text. Apply data map to each element if it exists. 
   */
  def buildDenseVectorFromText(colText : String, dMap : Map[String, Int], dlm : String, dataMap : Option[Datamap]) : Vector = {
	    buildSparseVectorFromText(colText, dMap, dlm, dataMap).toDense
  }
  /** 
   *  Build a dense Vector from a single string 
   */
  def buildDenseVectorFromString(colText : String, dMap : Map[String, Int]) : Vector = {
	    buildSparseVectorFromString(colText, dMap).toDense
  }
  /** 
   *  Build a sparse Vector from delimited text. Apply data map to each element if it exists.  
   */
  def buildSparseVectorFromText(colText : String, dMap : Map[String, Int], dlm : String, dataMap : Option[Datamap]) : Vector = {
	    val l = colText.split(dlm).map(t => { 
	      if (dataMap.isDefined) dMap(dataMap.get.getValue(t))
	      else dMap(t)
	    }).toArray.distinct
	    Vectors.sparse(dMap.size, l, Array.fill[Double](l.size)(1.0))
  }
  /** 
   *  Build a sparse Vector from a single string 
   */
  def buildSparseVectorFromString(colText : String, dMap : Map[String, Int]) : Vector = {
	    val l = Array[Int](dMap(colText))
	    Vectors.sparse(dMap.size, l, Array.fill[Double](l.size)(1.0))
  }
  /** 
   *  Build a one column Vector from an Int 
   */
  def buildVector(value : Int) = Vectors.dense(value.toDouble)
  /** 
   *  Build a one column Vector from a Double 
   */
  def buildVector(value : Double) = Vectors.dense(value)
  /** 
   *  Build a one column Vector from a Boolean 
   */
  def buildVector(value : Boolean) = if (value) Vectors.dense(1.0) else Vectors.dense(0.0)
  /** 
   *  Assemble takes a generated List of Vectors and merges them into a single Vector 
   */
  def assemble(vv: List[Vector]): Vector = {
    val indices = ArrayBuilder.make[Int]
    val values = ArrayBuilder.make[Double]
    var cur = 0
    var totalLength = 0
    vv.foreach {vec => {
        //if (first) { ScalaUtil.controlMsg(s"Length=${vec.size} is ${vec.toString()}"); totalLength += vec.size; }
        vec.foreachActive { case (i, v) =>
          if (v != 0.0) {
            indices += (cur + i)
            values += v
          }
        }
        cur += vec.size
      }
    }
    //if (first) ScalaUtil.controlMsg(s"Total length=$totalLength")
    //first = false
    Vectors.sparse(cur, indices.result(), values.result()).compressed
  }
  def decodeVectorToText(v : Vector, invMap : Map[Int, String], dlm : String) : String = {
    val sb = new StringBuilder()
    for (i <- 0 to v.size - 1) {
      if (v(i) != 0.0) {
        if (sb.length > 0) sb.append(dlm)
        sb.append(invMap(i))
      }
    }
    sb.toString()
  }  
  def decodeVectorToString(v : Vector, invMap : Map[Int, String]) : String = {
    for (i <- 0 to v.size - 1) {
      if (v(i) != 0.0) return (invMap(i))
    }
    "?"
  }
  def decodeVectorFromFeatureSet(v : Vector, fs : FeatureSet) : Array[String] = {
    val retArray = Array[String]()
    var pos = 0
    fs.features.foreach( f => {
      retArray :+ f.decode(slice(v, pos, f.getVectorLength()))
    })
    retArray
  }
  def slice(v: Vector, pos : Int, len : Int) : Vector = {
     var a = ArrayBuilder.make[Double]()
     for (i <- pos to (pos + len -1)) a += v(i)
     Vectors.dense(a.result())
  }
  def getFeatureAndValue(fs: FeatureSet, pos : Int) : String = {
    for (f <- fs.features) {
      if (pos >= f.getPosition() && pos <= (f.getPosition() + f.getVectorLength() - 1))
          return f.decodeID(pos)
    }
    "?"
  }
}