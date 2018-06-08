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
		.config("hive.metastore.uris", "thrift://ai04.analyticsinside.us:9083")
		.getOrCreate() 
		import sc.implicits._
		sc.sql("use "+SchemaName)

		val queryDF =sc.sql("select * from "+TableName+" limit "+QLimit)
		val queryValues=queryDF.map(_.toString).collect.flatMap(_.split(","))
		val queryTypes=queryDF.dtypes
		val queryCombined=queryTypes.zip(queryValues)
		val queryFinal=queryCombined.map((x=>(x._1._1.replace("[","").replace("]",""),x._2.replace("[","").replace("]",""),x._1._2.replace("[","").replace("]",""))))
		
		queryFinal.foreach(println)
		sc.stop()

	     queryFinal
	 }
	}
/*
     
    val longTypes = for (i<- 1 to queryValues.length/queryTypes.length) yield 
    {
	   ++ queryTypes
    }
	}
}
Next step is to extract dataType from the schema of the dataFrame and create a iterator.

val fieldTypesList = df.schema.map(struct => struct.dataType)

Next step is to convert the dataframe rows into rdd list and map each value to dataType from the list created above

  val dfList = df.rdd.map(row => row.toString().replace("[","").replace("]","").split(",").toList)
  val tuples = dfList.map(list => list.map(value => (value, fieldTypesList(list.indexOf(value)))) */

  /* updated code

val queryValues = queryDF.rdd.map(row => row.toString().replace("[","").replace("]","").split(","))
val queryTypes=queryDF.dtypes
val queryCombined = queryValues.map(list => list.map(value => (queryTypes(list.indexOf(value)),value)))
val queryFinal= queryCombined.collect.map(_.map((x=>(x._1._1,x._2,x._1._2))))
 queryFinal.map(_.mkString).foreach(println)
*/
