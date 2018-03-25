package com.ai.relpredict.dsl

import com.ai.relpredict.util.ScalaUtil

class FeatureDef(val name : String, val varType : String, val desc : String, parmString : String) {
    val parms : Map[String, String] = ScalaUtil.makeParms(parmString)
    def print() : Unit = {
       val p = if (parms.size == 0) "*none*" else parms.mkString(",")
       ScalaUtil.writeInfo(s"      Feature=$name $varType $desc Parms: $p")
    }
}