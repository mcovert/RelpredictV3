package com.ai.relpredict.test

import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter

import com.ai.relpredict.util._
import com.ai.relpredict.spark._

@RunWith(classOf[JUnitRunner])
class VectorTest extends FunSuite with BeforeAndAfter {
  test("Vector test") {
    val map = Map(0 -> "A", 1 -> "B", 2 -> "C", 3 -> "D")
    val invMap = (Map() ++ map.map(_.swap))
    val dlm = ","
    
    val text = Array("A,B,C,D", "A,C,D", "A,D", "B")
    val text2 = Array("A", "B", "C", "D")
    
    text.foreach( x => {
       val v = VectorBuilder.buildDenseVectorFromText(x, invMap, dlm, None)
       assert(v.size == 4)
       println("Vector:" + x)
       v.toArray.foreach(x => print(x.toString() + " "))
       println("Decode: " + VectorBuilder.decodeVectorToText(v, map, dlm))
       println("")
    })
    text2.foreach( x => {
       val v = VectorBuilder.buildDenseVectorFromString(x, invMap)
       assert(v.size == 4)
       println("Vector: " + x)
       v.toArray.foreach(x => print(x.toString() + " "))
       println("Decode: " + VectorBuilder.decodeVectorToString(v, map))
       println("")
    })
    val vList = text.map( x => VectorBuilder.buildDenseVectorFromText(x, invMap, dlm, None)).toList
    val vFull = VectorBuilder.assemble(vList)
    assert(vFull.size == 16)
    print("Assembled Vector: ")
    vFull.toArray.foreach(x => print(x.toString() + " "))
    println("")
  } 
  test("Feature Set Test") {
    val map = Map(0 -> "A", 1 -> "B", 2 -> "C", 3 -> "D")
    val invMap = (Map() ++ map.map(_.swap))
    val dlm = ","
    
    val text = Array("A,B,C,D", "A,C,D", "A,D", "B")
    val vList = text.map( x => VectorBuilder.buildDenseVectorFromText(x, invMap, dlm, None)).toList
    val vFull = VectorBuilder.assemble(vList)
    print("Assembled Vector: ")
    vFull.toArray.foreach(x => print(x.toString() + " ")) 
    println("")
    for (i <- 0 to 3) { 
      val v = VectorBuilder.slice(vFull, i * 4, 4).toArray
      print(s"Vector $i Length(${v.size}): ")
      v.foreach(x => print(x.toString() + " "))
      println("")
    }
  }
}