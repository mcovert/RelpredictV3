package com.ai.relpredict.jobs

import com.ai.relpredict.spark._
import java.util.Calendar
import com.ai.relpredict.dsl._
import org.apache.spark.sql.SparkSession
import com.ai.relpredict.util._
import scala.collection.mutable.ArrayBuffer

abstract class Job(val jobname: String, modelDef: Model, config: Config, jobParms : Map[String, String],
                   val dMap: Map[String, Datamap], val columnMap: Datamap, var results: Results) {
  val starttime : java.util.Date          = ScalaUtil.getDate()
  val st                                  = System.currentTimeMillis
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
  def cleanup()  { 
    val endtime = ScalaUtil.getDate()
    jobResults.put("job.endtime", ScalaUtil.getDateTimeString(endtime))
    jobResults.put("job.runtime", "%1d ms".format(System.currentTimeMillis - start))
  }
  setupJob() {
    jobResults.put("starttime", ScalaUtil.getDateTimeString(starttime))
    jobResults.put("jobname", jobname)
    jobResults.put("id", jobID)
    jobResults.put("parms", ScalaUtil.makeParmString(jobParms))
    jobResults.put("config", conf.getConfString())    
  }
  setupModel() {
      modelResults.put("model_class",      config.model_class);
      modelResults.put("model_name",       config.model_name);
      modelResults.put("model_version",    config.model_version);
      modelResults.put("model_train_date", config.model_train_date);
      modelResults.addArray("targets")    
  }
  setupData() {}
} 