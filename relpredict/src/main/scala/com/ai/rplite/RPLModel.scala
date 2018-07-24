package com.ai.rplite

import scala.collection.mutable.ArrayBuffer

case class RPLModel(val model_class:   String, val model_name: String, 
	                val model_version: String, var model_train_date: String) {
   var features: ArrayBuffer[RPLFeature] = ArrayBuffer[RPLFeature]() 
   var targets:  ArrayBuffer[RPLTarget]  = ArrayBuffer[RPLTarget]()
   var id: String = "id"
   var parms = RPLParameters()
   var lastParms: RPLParameters = parms
   def addFeature(feature: RPLFeature) { 
   	  features += feature 
   	  lastParms = feature.parms
   }
   def addTarget(target: RPLTarget) { 
   	  targets += target 
   	  lastParms = target.parms
   }
   def addAlgorithm(algorithm: RPLAlgorithm) { 
   	targets(targets.size - 1).addAlgorithm(algorithm) 
   	lastParms = algorithm.parms
   }
   def addParm(kv: String) { lastParms.addParm(kv) }
   def addParm(k: String, v: String) { lastParms.addParm(k, v) }
   def setId(model_id: String) { id = model_id }
}
case class RPLFeature(val feature_name: String, val feature_type: String) {
   var parms = RPLParameters()
}
case class RPLTarget(val target_name: String, val target_type: String) {
   var parms = RPLParameters()
   var algorithms : ArrayBuffer[RPLAlgorithm] = ArrayBuffer[RPLAlgorithm]()
   def addAlgorithm(algorithm: RPLAlgorithm) { algorithms += algorithm }
}
case class RPLAlgorithm(val alg_name: String) {
   var parms = RPLParameters()
}
case class RPLParameters() {
	var parms = scala.collection.mutable.Map[String, String]()
	def addParm(kv: String) {
        val kv_tokens = kv.split("=")
        parms(kv_tokens(0)) = kv_tokens(1)
	}
	def addParm(k: String, v: String) {
        parms(k) = v
	}
}
