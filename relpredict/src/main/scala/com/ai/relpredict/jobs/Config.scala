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
      def default_values = Map("split"    -> "0.8", 
                               "base_dir" -> "/relpredict", 
                               "env"      -> "yarn", 
                               "verbose"  -> "true",
                               "debug"    -> "false",
                               "run"      -> "true"   )
      def merge(_config : Option[Config]) : Config = {
         _config match {

            case Some(_config) => {
              val p01 = if (_config.jobname    == "") jobname    else _config.jobname
              val p02 = if (_config.sql        == "") sql        else _config.sql
              val p03 = if (_config.table      == "") table      else _config.table
              val p04 = if (_config.limit      == "") limit      else _config.limit
              val p05 = if (_config.data_def   == "") data_def   else _config.data_def
              val p06 = if (_config.split      == "") split      else _config.split
              val p07 = if (_config.base_dir   == "") base_dir   else _config.base_dir
              val p07a= if (_config.job_dir    == "") job_dir    else _config.job_dir
              val p08 = if (_config.run_type   == "") run_type   else _config.run_type
              val p08a= if (_config.env        == "") env        else _config.env
              val p09 = if (_config.model_def  == "") model_def  else _config.model_def
              val p10 = if (_config.run_id     == "") run_id     else _config.run_id
              val p11 = if (_config.data_maps  == "") data_maps  else _config.data_maps
              val p12 = if (_config.column_map == "") column_map else _config.column_map
              val p13 = if (_config.verbose    == "") verbose    else _config.verbose
              val p14 = if (_config.debug      == "") debug      else _config.debug
              val p15 = if (_config.parms      == "") parms      else _config.parms
              val p16 = if (_config.run        == "") run        else _config.run
              val p17 = if (_config.config     == "") config     else _config.config

              return Config(jobname   = p01,    sql      = p02,    table     = p03,     limit      = p04, 
                            data_def  = p05,    split    = p06,    base_dir  = p07,  
                            job_dir   = p07a,   run_type = p08,    env       = p08a, 
                            model_def = p09,    run_id   = p10,    data_maps = p11,     column_map = p12, 
                            verbose   = p13,    debug    = p14,    parms     = p15,     run        = p16, 
                            config    = p17)
            }
            case None => return this
         }
      }
      def merge(_config : Map[String, String]) : Config = {
            val p01 = _config.getOrElse("jobname",    jobname)
            val p02 = _config.getOrElse("sql",        sql)
            val p03 = _config.getOrElse("table",      table)
            val p04 = _config.getOrElse("limit",      limit)
            val p05 = _config.getOrElse("data_def",   data_def)
            val p06 = _config.getOrElse("split",      split)
            val p07 = _config.getOrElse("base_dir",   base_dir)
            val p07a= _config.getOrElse("job_dir",    job_dir)
            val p08 = _config.getOrElse("run_type",   run_type)
            val p08a= _config.getOrElse("env",        env)
            val p09 = _config.getOrElse("model_def",  model_def)
            val p10 = _config.getOrElse("run_id",     run_id)
            val p11 = _config.getOrElse("data_maps",  data_maps)
            val p12 = _config.getOrElse("column_map", column_map)
            val p13 = _config.getOrElse("verbose",    verbose)
            val p14 = _config.getOrElse("debug",      debug)
            val p15 = _config.getOrElse("parms",      parms)
            val p16 = _config.getOrElse("run",        run)
            val p17 = _config.getOrElse("config",     config)

              return Config(jobname   = p01,    sql      = p02,    table     = p03,     limit      = p04, 
                            data_def  = p05,    split    = p06,    base_dir  = p07,  
                            job_dir   = p07a,   run_type = p08,    env       = p08a, 
                            model_def = p09,    run_id   = p10,    data_maps = p11,     column_map = p12, 
                            verbose   = p13,    debug    = p14,    parms     = p15,     run        = p16, 
                            config    = p17)
      }
      def setDefaults() : Config = { return merge(default_values) }

      def print() {
            ScalaUtil.writeInfo("--------------Start Configuration--------------")
            ScalaUtil.writeInfo("jobname:    " + jobname)
            ScalaUtil.writeInfo("sql:        " + sql)
            ScalaUtil.writeInfo("table:      " + table)
            ScalaUtil.writeInfo("limit:      " + limit)
            ScalaUtil.writeInfo("data_def:   " + data_def)
            ScalaUtil.writeInfo("split:      " + split)
            ScalaUtil.writeInfo("base_dir:   " + base_dir)
            ScalaUtil.writeInfo("job_dir:    " + job_dir)
            ScalaUtil.writeInfo("run_type:   " + run_type)
            ScalaUtil.writeInfo("env:        " + env)
            ScalaUtil.writeInfo("model_def:  " + model_def)
            ScalaUtil.writeInfo("run_id:     " + run_id)
            ScalaUtil.writeInfo("data_maps:  " + data_maps)
            ScalaUtil.writeInfo("column_map: " + column_map)
            ScalaUtil.writeInfo("verbose:    " + verbose)
            ScalaUtil.writeInfo("debug:      " + debug)
            ScalaUtil.writeInfo("parms:      " + parms)
            ScalaUtil.writeInfo("run:        " + run)
            ScalaUtil.writeInfo("config:     " + config)      
            ScalaUtil.writeInfo("---------------End Configuration---------------")
      }
      def getConfigString() = {
        return 
            "jobname="    + jobname + ";" +
            "sql="        + sql + ";" +
            "table="      + table + ";" +
            "limit="      + limit + ";" +
            "data_def="   + data_def + ";" +
            "split="      + split + ";" +
            "base_dir="   + base_dir + ";" +
            "job_dir="    + job_dir + ";" +
            "run_type="   + run_type + ";" +
            "env="        + env + ";" +
            "model_def="  + model_def + ";" +
            "run_id="     + run_id + ";" +
            "data_maps="  + data_maps + ";" +
            "column_map=" + column_map + ";" +
            "verbose="    + verbose + ";" +
            "debug="      + debug + ";" +
            "parms="      + parms + ";" +
            "run="        + run + ";" +
            "config="     + config     

      }
}

