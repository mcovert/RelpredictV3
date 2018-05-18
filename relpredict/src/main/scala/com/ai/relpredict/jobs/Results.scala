package com.ai.relpredict.jobs

import play.api.libs.json._
/**
 * The Results object encapsulates all returned values from any stage (setup, run, cleanup) of a Job. It is also used by Algorithms
 * to return information. A Results object contains a return code and a set of key/value pairs that can store a variety of objects such 
 * as strings, integers, doubles, vectors and matrices. In addition, each value is actually an Option allowing null values to be stored.
 * Results objects can be merged. Note: Maintaining key name spaces for merges Results objects is the responsibility of the user.
 */
case class Results() extends Serializable {
  val OK    = 0
  val WARN  = 4
  val ERROR = 8
  val ABORT = 16
  private var rc : Int = OK
  var kvMap = scala.collection.mutable.Map[String, Option[Any]]()
  def setRC(r : Int) { if (r > rc) rc = r } 
  def getRC() = rc 
  def add(k : String, v : Option[Any]) = kvMap(k) = v
  def getKeys() = kvMap.keys
  def getMapEntries() = kvMap.toList
  def addDouble(k: String, value : Double) = kvMap(k) = Some(value)
  def addString(k : String, value : String) = kvMap(k) = Some(value)
  def addVector(k : String, value : Array[Double]) = kvMap(k) = Some(value)
  def addMatrix(k : String, value : Array[Array[Double]]) = kvMap(k) = Some(value)
  def getDouble(k : String) : Option[Double] = {
      if (kvMap.contains(k)) Some(kvMap(k).asInstanceOf[Double])
      else None
  }
  def getString(k : String) : Option[String] = {
      if (kvMap.contains(k)) Some(kvMap(k).asInstanceOf[String])
      else None
  }
  def getVector(k : String) : Option[Array[Double]] = {
      if (kvMap.contains(k)) Some(kvMap(k).asInstanceOf[Array[Double]])
      else None
  }
  def getMatrix(k : String) : Option[Array[Array[Double]]] = {
      if (kvMap.contains(k)) Some(kvMap(k).asInstanceOf[Array[Array[Double]]])
      else None
  }
  def merge(r2 : Option[Results]) = {
    r2 match {
      case None => 
      case Some(rr) => rr.kvMap.foreach { case (k,v) => add(k, v)}
    }
    this
  }
  def merge(r2 : Results) : Results = {
    r2.kvMap.foreach { case (k,v) => add(k, v)}
    this
  }
  def merge(lr : List[Results]) : Results = {
    lr.fold(new Results())((r1, r2) => r1.merge(r2))
  }
  def toDelimitedDebugString(dlm : String) : String = {
    val sb = new StringBuilder()
    sb.append(s"RC=$rc$dlm")
    kvMap.foreach{case (k : String, v : Option[Any]) => sb.append(s"$k=${v.get.toString()}$dlm")}
    sb.toString()   
  }
  def toDebugString() : String = toDelimitedDebugString("\n")
  def toStringArray() : Array[String] = {
    kvMap.map{case (k : String, v : Option[Any]) => s"$k=${v.get.toString()}"}.toArray
  }
  def toJson() = {
    val js = kvMap.map({case (k, v) => (k, v.get.toString)})
    js.foreach(println)
    //Json.prettyPrint(js)
    //JsObject(js)
  }
}