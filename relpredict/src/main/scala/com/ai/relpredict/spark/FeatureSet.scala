package com.ai.relpredict.spark

import com.ai.relpredict.util.ScalaUtil

/**
 * A FeatureSet is a named set of Features. They are assigned to a Target.
 */
case class FeatureSet(name : String, features : List[Feature[_]], id : String) {
  var pos = 0
  features.foreach(f => { f.setPosition(pos); pos += f.getVectorLength(); })
  if (ScalaUtil.verbose) {
      features.foreach(f => { ScalaUtil.writeInfo(s"Feature: ${f.getName()} type=${f.getType()} count=${f.getCount()} position=${f.getPosition()} length=${f.getVectorLength()}")})    
  }
}