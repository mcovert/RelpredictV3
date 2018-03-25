package com.ai.relpredict.util

import org.apache.spark.ml.param.Param
import org.apache.spark.ml.Estimator

object ParameterMapper {
  def insertParms(est : Estimator[_], parms : Map[String, String]) {
     parms.map( { case (k, v) => 
                     val p = est.getParam(k)
                     p match {
                       case x : Param[Any] => est.set(p, v)
                       case _ =>
                     }
                  case _ => 
                })
  }
}