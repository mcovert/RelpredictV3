package com.ai.relpredict.spark

import org.apache.spark.mllib.tree.model._
import org.apache.spark.mllib.tree.configuration.FeatureType._
import com.ai.relpredict.util._
import scala.collection.mutable.ArrayBuilder

class DTNode() {
  var nodeText  : String = ""
  var level     : Integer = -1
  var parent    : Option[DTNode] = None
  var leftChild : Option[DTNode] = None
  var rightChild: Option[DTNode] = None
  def parse(line: String, tree: scala.collection.mutable.ArrayBuffer[String]) {
      nodeText   = line
      level      = ScalaUtil.indentCount(line)
      parent     = findParent(tree)
      //tree.add(this)
      val tokens = line.split("[ ]+")
      tokens(0) match {
        case "If"       => makeLeft(level, tokens(2).toInt, tokens(3), tokens(4).substring(0, tokens(4).length() - 1).toDouble) 
        case "Else"     => makeRight(level, tokens(2).toInt, tokens(3), tokens(4).substring(0, tokens(4).length() - 1).toDouble)
        case "Predict:" => makeLeaf(level, tokens(1).toDouble)
        case unknown    => ScalaUtil.writeError(s"Unknown sytax in decision tree: ${line}")
      }
  }
  def findParent(tree: scala.collection.mutable.ArrayBuffer[String]) = {
      None
  }
  def makeLeft(ilevel : Integer, featureNum : Integer, oper : String, splitVal : Double) {}
  def makeRight(ilevel : Integer, featureNum : Integer, oper : String, splitVal : Double) {}
  def makeLeaf(ilevel : Integer, predictedValue : Double) {}
}

object DecisionTreeUtil { 
}