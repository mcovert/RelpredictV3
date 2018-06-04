package com.ai.spark

import org.apache.spark.sql.SparkSession
import org.apache.spark.rdd.RDD
import org.apache.spark.sql._
import org.apache.spark.sql.types._




object QueryUtil
{
	def SparkQuery( DataSource : String, SchemaName : String, TableName : String, QLimit : String) : Array[(String,String,String)] = 
	{
		val sc = SparkSession.builder().appName("SparkQuery").config("spark.master", "local").enableHiveSupport()
		.config("yarn.resourcemanager.address","ai02.analyticsinside.us:8032")
		.config("hive.metastore.uris", "trift://ai04.analyticsinside.us:9083")
		.getOrCreate() 
		import sc.implicits._
		sc.sql("use "+SchemaName)

		val queryDF =sc.sql("select *  from "+TableName+" limit "+QLimit)
		val queryValues=queryDF.map(_.toString).collect.flatMap(_.split(","))
		val queryTypes=queryDF.dtypes
		val queryCombined=queryTypes.zip(queryValues)
		val queryFinal=queryCombined.map((x=>(x._1._1,x._2,x._1._2)))
		queryFinal.foreach(println)
		sc.stop()

	     queryFinal

	}
}
