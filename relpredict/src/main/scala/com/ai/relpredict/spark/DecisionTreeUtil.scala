package com.ai.relpredict.spark

import org.apache.spark.mllib.tree.model._
import org.apache.spark.mllib.tree.configuration.FeatureType._
import com.ai.relpredict.util._
import scala.collection.mutable.ArrayBuilder

case class DTNode(val index: Integer, val tree: scala.collection.mutable.ArrayBuffer[String], val featureSet: FeatureSet) {
  // var nodeText  : String = ""
  // var featureNum  = -1
  // var feature : Option[Feature] = None
  // var oper        = ""
  // var splitValue  = 0.0
  // var prob        = 0.0
  // var level     : Integer = -1
  // var parent    : Option[DTNode] = None
  // var leftChild : Option[DTNode] = None
  // var rightChild: Option[DTNode] = None
  // def parse(line: String, tree: scala.collection.mutable.ArrayBuffer[String]) {
  //     nodeText   = line
  //     level      = ScalaUtil.indentCount(line)
  //     parent     = findParent(tree)
  //     val tokens = line.split("[ ]+")
  //     tokens(0) match {
  //       case "If"       => fillNode(tokens(2).toInt, tokens(3), tokens(4).substring(0, tokens(4).length() - 1).toDouble) 
  //       case "Else"     => fillNode(level, tokens(2).toInt, tokens(3), tokens(4).substring(0, tokens(4).length() - 1).toDouble)
  //       case "Predict:" => makeLeaf(tokens(1).toDouble)
  //       case unknown    => ScalaUtil.writeError(s"Unknown syntax in decision tree: ${line}")
  //     }
  // }
  // def findParent() = {
  //     if (level == -1 || index == 0) None
  //     else {
  //        var i = index - 1
  //        while (tree(i).level >= level) i -= 1
  //        Some(tree(i)) 
  //     }
  // }
  // def fillNode(featureNumber : Integer, operator : String, splitVal : Double) {
  //   featureNum = featureNumber
  //   feature    = Some(featureSet.features(featureNum))
  //   oper       = operator
  //   splitValue = splitVal
  // }
  // def makeLeaf(predictedValue : Double) {
  // }
}

object DecisionTreeUtil { 
}