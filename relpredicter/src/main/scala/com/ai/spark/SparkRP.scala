package com.ai.spark

import org.apache.spark.sql.SparkSession
import org.apache.spark.rdd.RDD
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.sql.functions._




object RPUtil
{
	def json2Df  (jsonStr: String) : DataFrame
    = 
	{
		val sc = SparkSession.builder().appName("SparkQuery").config("spark.master", "local").enableHiveSupport()
		.config("yarn.resourcemanager.address","ai02.analyticsinside.us:8032")
		.config("hive.metastore.uris", "thrift://ai04.analyticsinside.us:9083")
		.getOrCreate() 
		import sc.implicits._
		
		val rdd =sc.sparkContext.parallelize(Seq(jsonStr))
		val df = sc.read.json(rdd)
		val dfRecords = df.select(explode(df("records"))).toDF("records")
		val dfFinal = dfRecords.select("records.identifier", "records.edi_payer_code", "records.insurance_type", "records.claim_amount",
			"records.patient_responsibility_amount", "records.procedure_codes", "records.diagnosis_codes", "records.client", 
			"records.facility", "records.state", "records.zip_code", "records.provider", "records.patient_referred", "records.claim_filing_type", 
			"records.patient_precert", "records.patient_type")
		dfFinal
	 }
	
}

