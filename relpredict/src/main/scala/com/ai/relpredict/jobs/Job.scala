package com.ai.relpredict.jobs

import com.ai.relpredict.spark._
import java.util.Calendar
import com.ai.relpredict.dsl._
import org.apache.spark.sql.SparkSession
import com.ai.relpredict.util._
import scala.collection.mutable.ArrayBuffer

abstract class Job(val jobname: String, val modelDef: Model, val config: Config, 
                   val jobParms : Map[String, String], val dataMaps: Map[String, Datamap], 
                   val columnMap: Datamap) {
  val starttime : java.util.Date          = ScalaUtil.getDate()
  val start                               = System.currentTimeMillis
  val jobID                               = ScalaUtil.getDirectoryDate(starttime)
  var baseResults      : Results          = new Results()          
  var jobResults       : Results          = new Results()                        
  var modelResults     : Results          = new Results()                        
  var dataResults      : Results          = new Results()                        

  /**
   * Called before a job is run
   * Saves job level information into the supplied Results object
   */
  def setup() {
    baseResults.put("job",   jobResults)
    setupJob()
    baseResults.put("model", modelResults)
    setupModel()
    baseResults.put("data",  dataResults)
    setupData()
  }
  /**
   * Called to execute the job
   */
  def run()
  /**
   * Called when the job has completed
   */
  def cleanup() : Results = { 
    val endtime = ScalaUtil.getDate()
    jobResults.put("endtime", ScalaUtil.getDateTimeString(endtime))
    jobResults.put("runtime", "%1d ms".format(System.currentTimeMillis - start))
    baseResults
  }
  def setupJob() {
    jobResults.put("starttime", ScalaUtil.getDateTimeString(starttime))
    jobResults.put("jobname", jobname)
    jobResults.put("id", jobID)
    jobResults.put("parms", ScalaUtil.makeParmString(jobParms))
    jobResults.put("config", config.getConfigString())    
  }
  def setupModel() {
      modelResults.put("model_class",      config.model_class);
      modelResults.put("model_name",       config.model_name);
      modelResults.put("model_version",    config.model_version);
      modelResults.put("model_train_date", config.model_train_date);
      modelResults.addArray("targets")    
  }
  def setupData() {
      dataResults.put("column_map", columnMap.getDatamapString())
      dataResults.addArray("datamaps")
      dataMaps.foreach{ case (k: String, dm: Datamap) => {
        var r = Results()
        r.put("datamap_name", dm.fileName)
        r.put("datamap_contents", dm.getDatamapString())
        dataResults.put("datamaps", r)
      }} 
  }
} 