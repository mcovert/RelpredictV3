package com.ai.relpredict.jobs

import com.ai.relpredict.util.ScalaUtil
import com.ai.relpredict.spark._

object RPConfig {
    private var baseDir = ""
    /**
     * Set up the base directory for RelPredict
     */
    def setBaseDir(dir : String) { 
      baseDir = if (dir.endsWith("/") || dir == "") dir else s"${dir}/"
      if (! new java.io.File(baseDir).exists) ScalaUtil.terminal_error(s"Base directory $baseDir does not exist")
    }
    /**
     * Get the base directory. Note that all directories returned will have "/" appended to the end.
     */
    def getBaseDir() = baseDir
    /**
     * Get the configuration directory
     */
    def getConfDir() = s"${baseDir}conf/"
    /**
     * Get the log directory
     */
    def getLogDir() = s"${baseDir}logs/"
    /**
     * Get the model directory for a specific model
     */
    def getModelDir(model : Model) : String = s"${baseDir}models/${model.name}/${model.version}/"
    /**
     * Get the model directory for a specific model and run ID. If none is specified, the current model is returned.
     */
    def getModelDir(model : Model, runID : String) : String = {
      if (runID == "") s"${getModelDir(model)}/current/"
      else s"${getModelDir(model)}/${runID}/"
    }
    /**
     * Get the target directory for a named target within a model
     */
    def getTargetDir(model : Model, runID : String, target : Target[_]) = {
      if (runID == "") s"${getModelDir(model, runID)}/${target.getName()}/"
      else s"${getModelDir(model)}/${runID}/${target.getName()}/"
    }
    /**
     * Get the algorithm directory for a specific algorithm used by a target within a model
     */
    def getAlgorithmDir(model : Model, runID : String, target : Target[_], algorithm : Algorithm) = s"${getTargetDir(model,  runID, target)}${algorithm.name}"
    /**
     * Get output directory for all saved data (from predict run).
     */
    def getDataDir() : String = s"${getBaseDir()}data/"
    /**
     * Get the output directory for a specific model
     */
    def getModelDataDir(model : Model) : String = s"${getDataDir()}${model.name}/${model.version}/"
    /**
     * Get the output directory for a model run
     */
    def getModelDataDir(model : Model, runID : String) : String = s"${getModelDataDir(model)}${runID}/"
    /**
     * Get the output directory for a model run target
     */
    def getTargetDataDir(model : Model, runID : String, target : Target[_]) = s"${getModelDataDir(model, runID)}${target.getName()}/"
    /**
     * Get the output directory for an algorithm and target for a model run
     */
    def getAlgorithmDataDir(model : Model, runID : String, target : Target[_], algorithm : Algorithm) = s"${getTargetDataDir(model,  runID, target)}${algorithm.name}"
}