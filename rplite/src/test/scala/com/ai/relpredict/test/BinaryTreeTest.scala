package com.ai.relpredict.test

import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter

import com.ai.relpredict.util._

@RunWith(classOf[JUnitRunner])
class BinaryTreeTest extends FunSuite with BeforeAndAfter {
  
  test("Build a binary tree") {
    val root = new BinaryTreeNode[Int](1)
    var last : BinaryTreeNode[Int] = root
    val depth = 10
    for (i <- 2 to depth) {
       val node = new BinaryTreeNode[Int](i)
       last.addLeft(node)
       last = node
    }
    val tree = new BinaryTree[Int](root)   
    assert(last.getLevel() == depth - 1)
  }
  test("Count nodes in a binary tree") {
    val root = new BinaryTreeNode[Int](1)
    var last : BinaryTreeNode[Int] = root
    val depth = 10
    for (i <- 2 to depth) {
       val node = new BinaryTreeNode[Int](i)
       val node2 = new BinaryTreeNode[Int](i + 100)
       last.addLeft(node)
       last.addRight(node2)
       last = node
    }
    val tree = new BinaryTree[Int](root)   
    assert(tree.size == (2 * depth - 1) )
  }
  test("Generate paths") {
    val root = new BinaryTreeNode[Int](1)
    var last : BinaryTreeNode[Int] = root
    val depth = 10
    for (i <- 2 to depth) {
       val node = new BinaryTreeNode[Int](i)
       val node2 = new BinaryTreeNode[Int](i + 100)
       last.addLeft(node)
       last.addRight(node2)
       if (i % 2 ==0) node2.addLeft(new BinaryTreeNode[Int](i + 200))
       else node2.addRight(new BinaryTreeNode[Int](i + 300))
       last = node
    }
    val tree = new BinaryTree[Int](root)   
    val pathList = tree.getPaths()
    pathList.foreach(p => { print("Path: "); p.foreach { n => print(n.content.toString() + " ") }; println("")})
  }
  
}