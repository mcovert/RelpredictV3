package com.ai.rplite

import org.apache.spark.sql.{SparkSession, DataFrame}
import com.ai.relpredict.spark.SparkUtil

/**
 * RPLMain <config_file> ...
 */
object RPLMain {
    var config: RPLConfig  = new RPLConfig() 
    var ss: SparkSession = SparkUtil.buildSparkSession("rplite", "yarn")
    def main(args: Array[String]) {
      config.load(args(0), ss) 
      val df = ss.sqlContext.sql(config.getQuery())
      df.cache
      val rplExec = new RPLExec()
      rplExec.buildPipeline(config, df, ss) 
      rplExec.run(config.getJobs())
    }
}