package com.ai.relpredict.jobs

import com.ai.relpredict.util.ScalaUtil

import scopt._
/*********************************************************/
/* Define the command line parameter _configuration class */
/* Undefined are empty strings and negative numbers      */
/*********************************************************/
case class Config(jobname:       String = "", 
                  sql:           String = "",
                  table:         String = "",
                  limit:         String = "",
                  data_def:      String = "",
                  split:         String = "",
                  base_dir:      String = "",
                  job_dir:       String = "", 
                  run_type:      String = "", 
                  env:           String = "", 
                  model_def:     String = "",
                  run_id:        String = "",
                  data_maps:     String = "",
                  column_map:    String = "",
                  verbose:       String = "",
                  debug:         String = "",
                  parms:         String = "",
                  run:           String = "",
                  config:        String = "")
{
      def default_values = Map("split" -> "0.8", 
                               "base_dir" -> "/relpredict", 
                               "env" -> "yarn", 
                               "verbose" -> "true",
                               "debug" -> "false"   )
      def merge(_config : Option[Config]) : Config = {
         _config match {

            case Some(_config) => {
              val p01 = if (_config.jobname    == "") this.jobname    else _config.jobname
              val p02 = if (_config.sql        == "") this.sql        else _config.sql
              val p03 = if (_config.table      == "") this.table      else _config.table
              val p04 = if (_config.limit      == "") this.limit      else _config.limit
              val p05 = if (_config.data_def   == "") this.data_def   else _config.data_def
              val p06 = if (_config.split      == "") this.split      else _config.split
              val p07 = if (_config.base_dir   == "") this.base_dir   else _config.base_dir
              val p08 = if (_config.run_type   == "") this.run_type   else _config.run_type
              val p09 = if (_config.model_def  == "") this.model_def  else _config.model_def
              val p10 = if (_config.run_id     == "") this.run_id     else _config.run_id
              val p11 = if (_config.data_maps  == "") this.data_maps  else _config.data_maps
              val p12 = if (_config.column_map == "") this.column_map else _config.column_map
              val p13 = if (_config.verbose    == "") this.verbose    else _config.verbose
              val p14 = if (_config.debug      == "") this.debug      else _config.debug
              val p15 = if (_config.parms      == "") this.parms      else _config.parms
              val p16 = if (_config.run        == "") this.run        else _config.run
              val p17 = if (_config.config     == "") this.config    else _config.config

              return Config(p01, p02, p03, p04, p05, p06, p07, p08, p09, p10,
                            p11, p12, p13, p14, p15, p16, p17)
            }
            case None => return this
         }
      }
      def merge(_config : Map[String, String]) : Config = {
            val p01 = _config.getOrElse("jobname",    this.jobname)
            val p02 = _config.getOrElse("sql",        this.sql)
            val p03 = _config.getOrElse("table",      this.table)
            val p04 = _config.getOrElse("limit",      this.limit)
            val p05 = _config.getOrElse("data_def",   this.data_def)
            val p06 = _config.getOrElse("split",      this.split)
            val p07 = _config.getOrElse("base_dir",   this.base_dir)
            val p08 = _config.getOrElse("run_type",   this.run_type)
            val p09 = _config.getOrElse("model_def",  this.model_def)
            val p10 = _config.getOrElse("run_id",     this.run_id)
            val p11 = _config.getOrElse("data_maps",  this.data_maps)
            val p12 = _config.getOrElse("column_map", this.column_map)
            val p13 = _config.getOrElse("verbose",    this.verbose)
            val p14 = _config.getOrElse("debug",      this.debug)
            val p15 = _config.getOrElse("parms",      this.parms)
            val p16 = _config.getOrElse("run",        this.run)
            val p17 = _config.getOrElse("config",     this.config)

            return Config(p01, p02, p03, p04, p05, p06, p07, p08, p09, p10,
                          p11, p12, p13, p14, p15, p16, p17)
      }
      def setDefaults() : Config = { return this.merge(default_values) }

      def print() {
            ScalaUtil.writeInfo("--------------Start Configuration--------------")
            ScalaUtil.writeInfo("jobname:    " + this.jobname)
            ScalaUtil.writeInfo("sql:        " + this.sql)
            ScalaUtil.writeInfo("table:      " + this.table)
            ScalaUtil.writeInfo("limit:      " + this.limit)
            ScalaUtil.writeInfo("data_def:   " + this.data_def)
            ScalaUtil.writeInfo("split:      " + this.split)
            ScalaUtil.writeInfo("base_dir:   " + this.base_dir)
            ScalaUtil.writeInfo("run_type:   " + this.run_type)
            ScalaUtil.writeInfo("model_def:  " + this.model_def)
            ScalaUtil.writeInfo("run_id:     " + this.run_id)
            ScalaUtil.writeInfo("data_maps:  " + this.data_maps)
            ScalaUtil.writeInfo("column_map: " + this.column_map)
            ScalaUtil.writeInfo("verbose:    " + this.verbose)
            ScalaUtil.writeInfo("debug:      " + this.debug)
            ScalaUtil.writeInfo("parms:      " + this.parms)
            ScalaUtil.writeInfo("run:        " + this.run)
            ScalaUtil.writeInfo("config:     " + this.config)      
            ScalaUtil.writeInfo("---------------End Configuration---------------")
      }
}

