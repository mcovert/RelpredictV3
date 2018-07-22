package com.ai.rplite

import org.apache.spark.sql.SparkSession

/**
 * RPLMain <config_file> ...
 */
object RPLMain {
    var config: RPLConfig  = new RPLConfig() 
    var ss: SparkSession =  = SparkUtil.buildSparkSession("rplite", "yarn")
    def main(args: Array[String]) {
      args.foreach{arg => config.loadConfig(arg)} 
      
      config.loadModel()
      config.run()
    }
}