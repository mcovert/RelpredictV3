package com.ai.relpredict.jobs

import com.ai.relpredict.spark._
import java.util.Calendar
import com.ai.relpredict.dsl._
import org.apache.spark.sql.SparkSession
import com.ai.relpredict.util._
import scala.collection.mutable.ArrayBuffer

abstract class Job(val jobname: String, modelDef: Model, config: Config, jobParms : Map[String, String],
                   var results: Results) {
  val starttime : java.util.Date = ScalaUtil.getDate()
  val st                         = System.currentTimeMillis
  val jobID                      = ScalaUtil.getDirectoryDate(starttime)
  /**
   * Called before a job is run
   * Saves job level information into the supplied Results object
   */
  def setup(results: Results) {
    results.put("job.starttime", ScalaUtil.getDateTimeString(starttime))
    results.put("job.jobname", jobname)
    results.put("job.id", jobID)
    results.put("job.parms", ScalaUtil.makeParmString(jobParms))
    results.put("job.config", conf.getConfString())
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
    results.put("job.endtime", ScalaUtil.getDateTimeString(endtime))
    results.put("job.runtime", "%1d ms".format(System.currentTimeMillis - start))
  }
} 