package com.ai.relpredict.dsl

import com.ai.relpredict.util.ScalaUtil

case class AlgorithmDef(parmString : String) {
  val parms : Map[String, String] = ScalaUtil.makeParms(parmString)
  val name = parms("algorithm")
  def print() : Unit = { ScalaUtil.writeInfo("      Algorithm: " + parms.mkString(","))}
}
