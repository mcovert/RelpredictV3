package com.ai.relpredict.util

import scala.io.Source

case class Datamap(val fileName : String) extends Serializable {
  val dmap : Map[String, String] = makeMap(fileName)
  
  def makeMap(fileName : String) : Map[String, String] = {
    if (fileName.isEmpty()) return Map[String, String]()
    try {
      val mapData = Source.fromFile(fileName).getLines.map(x => {
        val kv = x.split(",")
        (kv(0).trim, kv(1).trim)
      }).toMap
      mapData
    } catch {
      case unknown : Throwable => {
        ScalaUtil.writeError(s"Error loading datamap from $fileName")
        ScalaUtil.writeError(unknown.toString())
        ScalaUtil.writeError("Ignoring file")
        Map[String, String]()
      }
    }
  }
  def getUniqueValues() : Array[String] = dmap.values.toList.distinct.toArray
  def getValue(in : String) : String = dmap.getOrElse(in, in)
  def print() = {
    ScalaUtil.writeInfo(s"Datamap: $fileName")
    dmap.toList.foreach(m => {
      val (k, v) = m
      ScalaUtil.writeInfo(s"  $k -> $v")
    })
  }
  def getDatamapString() = {
    var sb = new StringBuilder()
    dmap.toList.foreach(m => {
      val (k, v) = m
      sb.append(s"$k -> $v;")
    })
    sb.toString()
  }
}