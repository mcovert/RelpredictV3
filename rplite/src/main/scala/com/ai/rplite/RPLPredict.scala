package com.ai.rplite

import org.apache.spark.sql.{SparkSession, DataFrame}
import com.ai.relpredict.spark._

/**
 * RPLMain <config_file> ...
 */
object RPLPredict {
    var config: RPLConfig  = new RPLConfig() 
    var ss: SparkSession = SparkUtil.buildSparkSession("rplite", "yarn")
    def main(args: Array[String]) {
      config.load(args(0), ss) 
      val df = ss.sqlContext.sql(config.getQuery())
      df.cache
      val rplExec = new RPLExec(config)
      rplExec.display()
    }
}