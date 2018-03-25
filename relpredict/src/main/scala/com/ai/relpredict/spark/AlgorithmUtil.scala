package com.ai.relpredict.spark

import com.ai.relpredict.util._
import org.apache.spark.rdd._

object AlgorithmUtil {
  /**
   * Generate decision tree model text from input string by substituting feature names and values for vector indices.
   */
  def getTreeModelText(treeString : String, target : Target[_], dlm : String = "|") = {
    val lines = treeString.split("\n")
    val sb = new StringBuilder(s"Decision tree for target ${target.getName()}$dlm")
    for (line <- lines) {
        val tokens = line.trim().split("[ ]+")
        if (tokens(0) == "Predict:") {
          val line2 = line.replace("Predict: ","predict=")
          sb.append(line2.replace(tokens(1), target.decode(tokens(1).toDouble).toString()))
          sb.append(dlm)
        }
        else if (tokens(1) == "(feature") {
          val featureNum = tokens(2).toInt
          val line2 = line.replaceFirst("feature ", "")
          sb.append(line2.replaceFirst(tokens(2), VectorBuilder.getFeatureAndValue(target.featureSet, featureNum)))
          sb.append(dlm)
        }
    }
    sb.toString()
  } 
  /** 
   *  Generate a confusion matrix
   */
  def confusionToResultString(matrix : Array[Array[Double]], invMap : Map[Int, String]) : String = {
    val sb = new StringBuilder(s"(${invMap(0)}")
    for (i <- 1 to invMap.size - 1) sb.append(s",${invMap(i)}")
    sb.append(")")
    for (i <- 0 to invMap.size - 1 ) {
       for (j <- 0 to invMap.size - 1) {
          sb.append(s",${matrix(i)(j).toString}")
       }
    } 
    sb.toString()
  }
  /** 
   *  Generate a confusion matrix
   */
  def confusionToString(matrix : Array[Array[Double]], invMap : Map[Int, String], dlm : String = "\n") : String = {
    val sb = new StringBuilder()
    sb.append(s"confusion_matrix$dlm")
    val sb2 = new StringBuilder("                    ")
    for (i <- 0 to invMap.size - 1) sb2.append(invMap(i).padTo(20," " ).mkString)
    sb.append(sb2.toString())
    sb.append(dlm)
    for (i <- 0 to invMap.size - 1 ) {
       sb2.clear()
       sb.append(invMap(i).padTo(20," " ).mkString)
       for (j <- 0 to invMap.size - 1) {
          sb2.append(matrix(i)(j).toString.padTo(20," " ).mkString)
       }
       sb.append(sb2.toString())
       sb.append(dlm)
    } 
    sb.toString()
  }
  /** 
   *  Print a confusion matrix
   */
  def printConfusion(matrix : Array[Array[Double]], invMap : Map[Int, String]) {
    ScalaUtil.writeInfo(confusionToString(matrix, invMap, "\n"))
  }
  /**
   * Compute model error from a standard prediction Dataframe 
   */
  def getError(resultdf : RDD[(String, Double, Double)]) : Double = {
    resultdf.filter(r => r._2 != r._3).count().toDouble / resultdf.count()
  }
  /**
   * Create a confusion matrix
   */
  def getConfusionMatrix(resultdf : RDD[(String, Double, Double)], target : Target[_]) = {
    var matrix = Array.ofDim[Double](target.size, target.size)
    resultdf.collect.foreach(r => matrix(r._2.toInt)(r._3.toInt) += 1)
    matrix
  }
}