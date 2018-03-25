package com.ai.relpredict.dsl

import com.ai.relpredict.util.ScalaUtil

case class ModelDef(name : String, version : String, desc : String, featureSets : List[FeatureSetDef], targets : List[TargetDef])
{
  def getTarget(name : String) : Option[TargetDef] = {
    targets.foreach(t => {if (t.name == name) return Some(t)})
    None
  }
  def getFeatureSet(name : String) :Option[FeatureSetDef] = {
    featureSets.foreach(fs => {if (fs.name == name) return Some(fs)})
    None    
  }
  def print() : Unit = {
      ScalaUtil.writeInfo(s"Model: Name=$name Version=$version Desc=$desc")
      featureSets.foreach(fs => fs.print())
      targets.foreach {t : TargetDef => t.print() }
  }
}