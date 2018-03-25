package com.ai.relpredict.dsl

import com.ai.relpredict.util.ScalaUtil

case class FeatureSetDef(name : String, features : List[FeatureDef], idName : String) {
    def print() : Unit = {
        ScalaUtil.writeInfo(s"   FeatureSet: $name id: $idName")
        features.foreach(f => f.print())
    }
}