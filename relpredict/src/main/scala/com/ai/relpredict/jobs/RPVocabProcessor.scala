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
    private var baseDir : String       = "/tmp/"
    val         vocabSuffix            = ".vocab"
    val         datamapSuffix          = ".datamap"

    def main(args: Array[String]) {
      import ss.implicits._
      import ss.sqlContext.implicits._
      baseDir = if (args(0).endsWith("/")) args(0) else args(0) + "/"
      val configFile = args(1)
      ScalaUtil.writeInfo(s"Creating vocabulary files in ${baseDir} using configuration from ${configFile}") 
      val source = scala.io.Source.fromFile(configFile)
      source.getLines.foreach{l => {
      	val tokens = l.split(",")
        tokens(0) match {
       	   case "vocab" => createVocabFile(tokens(1), tokens(2))
           case "map"   => createDatamapFile(tokens(1), tokens(2))
           case _       => ScalaUtil.writeError(s"Unknown statement: ${l}")
        }
      }}
    }
    def createVocabFile(name: String, sql: String) {
    	// Run sql Command to get Dataframe and convert to indexed map
      val df = ss.sqlContext.sql(sql)
      val map = df.select(name).collect.map(r => r.getString(0)).distinct.zipWithIndex.toMap
    	// Write Map to HDFS File 
    	val sb = new StringBuilder()
    	map.keys.foreach{ k => sb.append(k.replace("\t","") + "\t" + map(k) + "\n")}
      val file = new File(baseDir + name + vocabSuffix)
      ScalaUtil.writeInfo(s"Creating ${file} with ${map.size} entries") 
      val bw = new BufferedWriter(new FileWriter(file))
      bw.write(sb.toString)
      bw.close   		
    }
    def createDatamapFile(name: String, sql: String) {
      val df = ss.sqlContext.sql(sql)
      val datamap = df.collect.map(r => (r.getString(0) -> r.getString(1))).toMap
      // Write Map to HDFS File 
      val sb = new StringBuilder()
      datamap.keys.foreach{ k => sb.append(k.replace("\t","") + "\t" + datamap(k) + "\n")}
      val file = new File(baseDir + name + datamapSuffix)
      ScalaUtil.writeInfo(s"Creating datamap ${name} with ${datamap.size} entries") 
      val bw = new BufferedWriter(new FileWriter(file))
      bw.write(sb.toString)
      bw.close      
    }
}