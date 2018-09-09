package com.ai.spark

import org.apache.spark.sql.SparkSession
import org.apache.spark.rdd.RDD
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.sql.functions._




object RPyUtil
{
	def json2Df  (rp_record: String) : DataFrame
    = 
	{
		val sc = SparkSession.builder().appName("SparkQuery").config("spark.master", "local").enableHiveSupport()
		.config("yarn.resourcemanager.address","ai02.analyticsinside.us:8032")
		.config("hive.metastore.uris", "thrift://ai04.analyticsinside.us:9083")
		.getOrCreate() 
		import sc.implicits._
		
		val rdd =sc.sparkContext.parellelize(Seq(jsonStr))
		val df = sc.read.json(rdd)
		df
	 }
	
}

