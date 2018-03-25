package com.ai.relpredict.jobs

import com.ai.relpredict.spark._
import java.util.Calendar
import com.ai.relpredict.dsl._
import org.apache.spark.sql.SparkSession
import com.ai.relpredict.util._

abstract class Job(val jobname: String, modelDef: Model, config: Config, jobParms : Map[String, String]) {
  val starttime    : java.util.Date = ScalaUtil.getDate()
  val jobID = ScalaUtil.getDirectoryDate(starttime)
  /**
   * Called before a job is run
   */
  def setup() : Results = {
    val r = new Results()
    r.addString("job.starttime", ScalaUtil.getDateTimeString(starttime))
    r.addString("job.jobname", jobname)
    r.addString("job.id", jobID)
    r.addString("job.parms", ScalaUtil.makeParmString(jobParms))
    r.addString("job.model.name", modelDef.name)
    r.addString("job.model.version", modelDef.version)
    r
  }
  /**
   * Called to execute the job
   */
  def run()   : Results
  /**
   * Called when the job has completed
   */
  def cleanup() : Results = { 
    val r = new Results()
    r.addString("job.endtime", ScalaUtil.getDateTimeString(ScalaUtil.getDate()))
    r
  }
} 