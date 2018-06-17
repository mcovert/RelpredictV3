package com.ai.relpredict.jobs

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
  private var kvMap = scala.collection.mutable.Map[String, Any]()
  def setRC(r : Int) { 
    if (r > rc) rc = r 
    kvMap("RC") = r
  } 
  def getRC() = rc 
  def getKeys() = kvMap.keys
  def put(k : String, v : Any) = kvMap(k) = v
  def get(k : String) : Option[Any] = {
      if (kvMap.contains(k)) Some(kvMap(k))
      else None
  }
  def getMap() = kvMap.toMap
  def toString() = {
    val sb = new StringBuilder()
    sb.append(s"RC=$rc; ")
    kvMap.foreach{case (k : String, v : Any) => sb.append(s"$k=${v.toString()}; ")}
    sb.toString()   
  }
}