package com.ai.relpredict.jobs

import com.ai.relpredict.spark._
import java.util.Calendar
import com.ai.relpredict.dsl._
import org.apache.spark.sql.SparkSession
import com.ai.relpredict.util._
import scala.collection.mutable.ArrayBuffer

abstract class Job(val jobname: String, modelDef: Model, config: Config, jobParms : Map[String, String]) {
  val starttime    : java.util.Date = ScalaUtil.getDate()
  val jobID                         = ScalaUtil.getDirectoryDate(starttime)
  var baseResults  : results
  /**
   * Called before a job is run
   * Saves job level information into the supplied Results object
   */
  def setup(results: Results) {
    baseResults = results
    jobResults.put("starttime", ScalaUtil.getDateTimeString(starttime))
    jobResults.put("jobname", jobname)
    jobResults.put("id", jobID)
    jobResults.put("parms", ScalaUtil.makeParmString(jobParms))
    jobResults.put("config", conf.getConfString())
    baseResults.put("job", jobResults)
  }
  /**
   * Called to execute the job
   */
  def run()
  /**
   * Called when the job has completed
   */
  def cleanup()  { 
    jobResults.put("endtime", ScalaUtil.getDateTimeString(ScalaUtil.getDate()))
  }
} 