package com.ai.relpredict.jobs

import scala.collection.mutable.ListBuffer
import scala.collection.mutable.ArrayBuffer

class ResultCollector {
	var results = scala.collection.mutable.Map[String, Any]()

	def addResult(name: String, r: Results) {
		match results(name) {
           case rval : None => results(name) = r
           case rval : Results => { 
           	  var lbuff = ListBuffer[Any]()
              lbuff += results(name)
              lbuff += r
              results(name) = lbuff
           }
           case rval : ListBuffer[Any] => rval += r
	}
	def getResults(name: String) : Option[Any] = {
        results(name) match {
        	case r: None => None
        	case _ => Some(r) 
        }
	}
	def getAlResults() = results
}