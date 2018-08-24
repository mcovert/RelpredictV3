package com.ai.rplite.utils

import org.apache.spark.rdd.RDD
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import java.io._

class ColumnMapper[A, B](inCol: String, defVal : B) {
	var defaultVal : B = defVal
	var scala.collection.mutable.Map[A, B] map = scala.collection.mutable.Map[A, B]()
	def load(df: DataFrame) {
        df.map(r => {
        	map(r.getAs[A]()) = r.getAs[B]()
        })
	}
	def load(buffReader: BufferedReader, dlm: String) throws Exception {
        while (br.ready()) {
        	val line = br.readLine()
        	if (!line.startsWith("#")) {
        	    val tokens = br.line.split(dlm)
        	    if (tokens.length >= 2) {
        	    	map(tokens(0).asInstanceOf[A]) = tokens(1).asInstanceOf[B]
        	    }
        	    else println(s"Error: Not enough tokens to do column map: ${line}")
            }
            br.close()
        }
	}
	def get(inValue: A) : B = {
		if (map.contains(inValue)) map(inValue)
		else defaultVal
	}
	def getMap() = map.toMap
}