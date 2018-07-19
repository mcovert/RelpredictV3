package com.ai.relpredict.jobs

import java.io._
import org.apache.spark.sql._
import com.ai.relpredict.util._


/**
*  Job to build global vocabularies
*
*{{{
* Command line formats:
*     rp_vocab output_dir config_file
*}}}        
*/
object RPVocabProcessor {
    private val ss      : SparkSession = SparkSession.builder().appName("rp_vocab").config("spark.master", "yarn").enableHiveSupport().getOrCreate() 
    private var baseDir : String = "/tmp/"

    def main(args: Array[String]) {
      import ss.implicits._
      import ss.sqlContext.implicits._
      baseDir = if (args(0).endsWith("/")) args(0) else args(0) + "/"
      val configFile = args(1)
      ScalaUtil.writeInfo(s"Creating vocabulary files in ${baseDir} using configuration from ${configFile}") 
      val source = scala.io.Source.fromFile(configFile)
      source.getLines.foreach{l => {
      	val tokens = l.split(",")
       	createMapFile(tokens(0), tokens(1))
      }}
    }
    def createMapFile(name: String, sql: String) {
    	// Run sql Command to get Dataframe and convert to indexed map
      val df = ss.sqlContext.sql(sql)
      val map = df.select(name).collect.map(r => r.getString(0)).distinct.zipWithIndex.toMap
    	// Write Map to HDFS File 
    	val sb = new StringBuilder()
    	map.keys.foreach{ k => sb.append(k.replace("\t","") + "\t" + map(k) + "\n")}
      val file = new File(baseDir + name + ".tsv")
      ScalaUtil.writeInfo(s"Creating ${file} with ${map.size} entries") 
      val bw = new BufferedWriter(new FileWriter(file))
      bw.write(sb.toString)
      bw.close   		
    }
}