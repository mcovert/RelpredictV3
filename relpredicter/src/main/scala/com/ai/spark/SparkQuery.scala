package com.ai.spark

import org.apache.spark.sql.SparkSession
import org.apache.spark.rdd.RDD
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.sql.functions._





object QueryUtil
{
	def SparkQuery( DataSource : String, SchemaName : String, TableName : String, QLimit : String) : Array[Array[(String,String,String)]] = 
	{
		val sc = SparkSession.builder().appName("SparkQuery").config("spark.master", "local").enableHiveSupport()
		.config("yarn.resourcemanager.address","ai02.analyticsinside.us:8032")
		.config("hive.metastore.uris", "thrift://ai04.analyticsinside.us:9083")
		.getOrCreate() 
		import sc.implicits._
		sc.sql("use "+SchemaName)

		val queryDFraw = if (QLimit=="0")
        {
        	sc.sql("select * from "+TableName)
        }
        else
        {
			sc.sql("select * from "+TableName+" limit "+QLimit)
		}
/*		val queryValues=queryDF.map(_.toString).collect.flatMap(_.split(","))
		val queryTypes=queryDF.dtypes
		val queryCombined=queryTypes.zip(queryValues)
		val queryFinal=queryCombined.map((x=>(x._1._1.replace("[","").replace("]",""),x._2.replace("[","").replace("]",""),x._1._2.replace("[","").replace("]",""))))
		
		queryFinal.foreach(println) */

		// Replace commas in filed values
		val queryDF= queryDFraw.select(queryDFraw.columns.map(c=>regexp_replace(col(c),"\\,"," ").alias(c)): _*)

		val queryValues = queryDF.rdd.map(row => row.toString().replace("[","").replace("]","").split(","))
		val queryTypes=queryDF.dtypes
		val queryCombined = queryValues.map(list => list.map(value => (queryTypes(list.indexOf(value)),value)))
		val queryFinal= queryCombined.collect.map(_.map((x=>(x._1._1,x._2,x._1._2))))
 		//queryFinal.map(_.mkString).foreach(println)
		sc.stop()
	    
	    queryFinal
	 }
	 def SparkTables( DataSource : String, SchemaName : String)
	 {
	 	val sc = SparkSession.builder().appName("SparkQuery").config("spark.master", "local").enableHiveSupport()
		.config("yarn.resourcemanager.address","ai02.analyticsinside.us:8032")
		.config("hive.metastore.uris", "thrift://ai04.analyticsinside.us:9083")
		.getOrCreate() 
		import sc.implicits._
	 	sc.sql("use "+SchemaName)
	 	val tablesNames=sc.sql("show tables")
	 	val tablesFinal=tablesNames.rdd.map(row=>row.toString().split(",")).collect.map(x=>(x(1)))
	 	sc.stop()
	    
	    tablesFinal
	 }

	}

