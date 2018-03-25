package com.ai.relpredict.util

import scala.collection.mutable.ListBuffer

class BinaryTree[A](val root: BinaryTreeNode[A]) {
  def getPaths() : ListBuffer[List[BinaryTreeNode[A]]] = {
    var list = ListBuffer[List[BinaryTreeNode[A]]]()
    val path = List[BinaryTreeNode[A]]()
    descend(Some(root), path, list)
    list
  }
  def size() = {
    root.size()    
  }
  def descend(n: Option[BinaryTreeNode[A]], p: List[BinaryTreeNode[A]], l: ListBuffer[List[BinaryTreeNode[A]]]) {
    n match {
      case None => 
      case Some(nn) => {
        val p2 = nn :: p
        if (!nn.hasChildren()) l += p2.reverse
        else {
          if (nn.left.isDefined) descend(nn.left, p2, l)
          if (nn.right.isDefined) descend(nn.right, p2, l)
        }
      }
    }
  }
}