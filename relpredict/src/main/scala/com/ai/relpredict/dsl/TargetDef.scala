package com.ai.relpredict.dsl

import com.ai.relpredict.util.ScalaUtil

case class TargetDef(name : String, targetType : String, desc : String, algs : String, featureSet : String, parmString : String) {
    val parms : Map[String, String] = ScalaUtil.makeParms(parmString)
    val algorithms = algs.split(";").map(a => new AlgorithmDef(a))
    def print() : Unit = {
        val p = if (parms.size == 0) "*none*" else parms.mkString(",")
        ScalaUtil.writeInfo(s"   Target=$name $targetType $desc  FeatureSet=$featureSet Parms: $p") 
        algorithms.foreach(alg => alg.print())
    }
}
