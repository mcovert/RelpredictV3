package com.ai.relpredict.util

class BinaryTreeNode[A](val content : A) {
  var left  : Option[BinaryTreeNode[A]] = None
  var right : Option[BinaryTreeNode[A]] = None
  var parent :  Option[BinaryTreeNode[A]] = None
  
  def size() : Int = {
    val l = left match {
      case None => 0
      case Some(n) => n.size()
    }
    val r = right match {
      case None => 0
      case Some(n) => n.size()
    }
    l + r + 1
  }
  def hasChildren() : Boolean = (left.isDefined || right.isDefined)
  def addLeft(child : BinaryTreeNode[A]) {
    left = Some(child)
    child.parent = Some(this)   
  }
  def addRight(child : BinaryTreeNode[A]) {
    right = Some(child)
    child.parent = Some(this)   
  }
  def getLevel() : Int = {
    parent match {
      case None => 0
      case Some(n) => n.getLevel() + 1
    }
  }
}