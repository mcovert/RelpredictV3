package com.ai.relpredict.spark

import org.apache.spark.mllib.tree.model._
import org.apache.spark.mllib.tree.configuration.FeatureType._
import com.ai.relpredict.util._
import scala.collection.mutable.ArrayBuilder

abstract class DTElement(val level : Integer)
case class Root() extends DTElement(-1)
case class IfStatement(ilevel : Integer, featureNum : Integer, oper : String, splitVal : Double) extends DTElement(ilevel)
case class ElseStatement(ilevel : Integer, featureNum : Integer, oper : String, splitVal : Double) extends DTElement(ilevel)
case class PredictStatement(ilevel : Integer, predictedValue : Double) extends DTElement(ilevel)
case class NullStatement(ilevel : Integer) extends DTElement(ilevel)

object DecisionTreeUtil { 
  def getModelText(modelText : String, fs : FeatureSet) : BinaryTree[DTElement] = {
    val elements : Array[DTElement] = modelText.split("\n").map(line => {
      val tokens = line.split("[ ]+")
      val level = ScalaUtil.indentCount(line)
      tokens(0) match {
        case "If"       => new IfStatement(level, tokens(2).toInt, tokens(3), tokens(4).substring(0, tokens(4).length() - 1).toDouble) 
        case "Else"     => new ElseStatement(level, tokens(2).toInt, tokens(3), tokens(4).substring(0, tokens(4).length() - 1).toDouble)
        case "Predict:" => new PredictStatement(level, tokens(1).toDouble)
        case unknown    => new NullStatement(level)
      }
    })
    val root = new BinaryTreeNode[DTElement](new Root())
    val tree = new BinaryTree[DTElement](root)
    buildTree(root, elements, 0)
    tree
  }
  def buildTree(baseElement : BinaryTreeNode[DTElement], elements : Array[DTElement], pos : Int) {
    val element = elements(pos)
    element match {
      case s : IfStatement => {
        if (s.level > baseElement.content.level) {
          val newElement = new BinaryTreeNode[DTElement](s) 
          baseElement.addLeft(newElement)
          buildTree(newElement, elements, pos +1)
        }
        else {
          /* Chase parent chain to find this element's parent node */
        }
      }
      case s : ElseStatement => {
        
      }
      case s : PredictStatement => {
        
      }
    }
    
  }
  /**
   * Build a CSV header for a Decision Tree model
   */
  def getCSVHeader(depth : Int) : String = {
    val sb = new StringBuilder
    for (i <- 1 to depth) { sb ++= "level"; sb ++= i.toString; sb ++= ","; }
    sb ++= "predict,prob\n"
    sb.toString()
  }
}