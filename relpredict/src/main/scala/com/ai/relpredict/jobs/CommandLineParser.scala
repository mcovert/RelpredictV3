package com.ai.relpredict.jobs

import scopt._

class CommandLineParser {
  def getParser() : OptionParser[Config] = {
      val parser = new scopt.OptionParser[Config]("relpredict") {
         head("relpredict", "3.0")

         opt[String]("jobname").action( (x, c) =>
           c.copy(jobname = x) ).text("The name of the spark job that will be submitted (relpredict)")
         opt[String]("sql").action( (x, c) =>
           c.copy(sql = x) ).text("SQL statement for input (select * from training)")
         opt[String]("data_def").action( (x, c) =>
           c.copy(data_def = x) ).text("Data definition file for complex encoded data")
         opt[String]("split").action( (x, c) =>
           c.copy(split = x) ).text("Fraction of input file to use for training (0.8)")
         opt[String]("run_type").action( (x, c) =>
           c.copy(run_type = x) ).text("The run type (train, predict) the job")
         opt[String]("env").action( (x, c) =>
           c.copy(env = x) ).text("The job run time type (yarn-cluster, yarn-client, local)")
         opt[String]("model_class").action( (x, c) =>
           c.copy(model_class = x) ).text("The class of the predictive model definition file (required)")
         opt[String]("model_name").action( (x, c) =>
           c.copy(model_name = x) ).text("The name of the predictive model definition file (required)")
         opt[String]("model_version").action( (x, c) =>
           c.copy(model_version = x) ).text("The version of the predictive model definition file (required)")
         opt[String]("model_train_date").action( (x, c) =>
           c.copy(model_train_date = x) ).text("The training date of the predictive model definition file (required)")
         opt[String]("run_id").action( (x, c) =>
           c.copy(run_id = x) ).text("The identifier of the trained model file to load (if not specified, the most recent trained model will be used)")
         opt[String]("data_maps").action( (x, c) =>
           c.copy(data_maps = x) ).text("The name of a data map files used to transform data (with format data_map_name=filename;data_map_name=filename;...)")
         opt[String]("column_map").action( (x, c) =>
           c.copy(column_map = x) ).text("The name of a data map file used to map column names")
         opt[String]("parms").action( (x, c) =>
           c.copy(parms = x) ).text("Parameters to be passed to the program (with format key=value;key=value;...)")
         opt[String]("verbose").action( (x, c) =>
           c.copy(verbose = x) ).text("Produce verbose output")
         opt[String]("debug").action( (x, c) =>
           c.copy(debug = x) ).text("Produce debugging output")
         opt[String]("run").action( (x, c) =>
           c.copy(run = x) ).text("Run the job (true)")
         opt[String]("base_dir").action( (x, c) =>
           c.copy(base_dir = x) ).text("Base directory")
         opt[String]("job_dir").action( (x, c) =>
           c.copy(job_dir = x) ).text("Job directory")
         opt[String]("table").action( (x, c) =>
           c.copy(table = x) ).text("Table name")
         opt[String]("limit").action( (x, c) =>
           c.copy(limit = x) ).text("Limit to this number of records")
         opt[String]("config").action( (x, c) =>
           c.copy(config = x) ).text("Configuration file")
     }
     parser
  }
}