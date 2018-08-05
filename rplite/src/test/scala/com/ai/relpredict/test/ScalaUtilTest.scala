package com.ai.relpredict.test

import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter

import com.ai.relpredict.util._

@RunWith(classOf[JUnitRunner])
class ScalaUtilTest extends FunSuite with BeforeAndAfter { 

    test("Test indent counter") {
    val text = "   test"
    assert(ScalaUtil.indentCount(text) == 3)
    val text2 = "test"
    assert(ScalaUtil.indentCount(text2) == 0)
    val text3 = "       "
    assert(ScalaUtil.indentCount(text3) == text3.length())
    val text4 = ""
    assert(ScalaUtil.indentCount(text4) == 0)
  }
}