package com.ai.relpredict.jobs

import scala.collection.mutable.{ArrayBuffer, Map}
/**
 * The Results object encapsulates all returned values from any stage (setup, run, cleanup) of a Job. It is also used by Algorithms
 * to return information. A Results object contains a return code and a set of key/value pairs that can store a variety of objects such 
 * as strings, integers, doubles, vectors and matrices. In addition, each value is actually an Option allowing null values to be stored.
 */
case class Results() extends Serializable {
  val OK    = 0
  val WARN  = 4
  val ERROR = 8
  val ABORT = 16
  private var rc : Int = OK
  private var kvMap = Map[String, Any]()
  def setRC(r : Int) { 
    if (r > rc) rc = r 
    kvMap("RC") = r
  } 
  def getRC() = rc 
  def getKeys() = kvMap.keys
  def put(k : String, v : Any) {
    v match {
      case r: Results => addResults(k, r)
      case _ => kvMap(k) = v

    }
  }
  def addArray(k: String) { kvMap(k) = ArrayBuffer[Results]() }
  def getArray(k: String) = {
    val kobj = kvMap(k)
    kobj match {
      case ab: ArrayBuffer[Results] => Some(ab)
      case _=> None
    }    
  }
  def get(k : String) : Option[Any] = {
      if (kvMap.contains(k)) Some(kvMap(k))
      else None
  }
  def getMap() = kvMap.toMap
  override def toString() = {
    val sb = new StringBuilder()
    sb.append(s"RC=$rc; ")
    kvMap.foreach{case (k : String, v : Any) => sb.append(s"$k=${v.toString()}; ")}
    sb.toString()   
  }
  def addResults(k: String, r: Results) {
    val kobj = kvMap.get(k)
    kobj match {
      case None => kvMap(k) = r
      case Some(ab: ArrayBuffer[Results]) => ab += r
      case _=> kvMap(k) = r
    }
  }
  def getResults(k: String) = {
    var r = kvMap.get(k)
    r match {
      case Some(rr : Results) => rr
      case _ => this  
    }
  }
}
