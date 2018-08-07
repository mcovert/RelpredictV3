package com.ai.rplite

import org.apache.spark.sql.{SparkSession, DataFrame}
import com.ai.relpredict.spark._

/**
 * RPLTrain <config_file> ...
 */
object RPLTrain {
    var config: RPLConfig  = new RPLConfig() 
    def main(args: Array[String]) {
      val parms = config.loadConfigFile(args(0)) 
      val ss = config.getSparkSession()
      val df = ss.sqlContext.sql(parms("SQL"))
      df.cache
      val rplExec = new RPLExec(config)
      rplExec.display()
    }
}