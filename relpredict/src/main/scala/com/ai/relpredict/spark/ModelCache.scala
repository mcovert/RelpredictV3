package com.ai.relpredict.spark

import com.ai.relpredict.util._

class ModelCache {
	var cache: scala.collection.mutable.Map[String, Model] = scala.collection.mutable.Map[String, Model]();

    private def makeKey(model_class: String, model_name: String, model_version: String) : String = {
    	model_class + "/" + model_name + "/" + model_version
    }
	def add(model_class: String, model_name: String, model_version: String, model: Model) {
        val key = makeKey(model_class, model_name, model_version)
        if (cache.contains(key)) ScalaUtil.writeWarning(s"Model ${key} exists in cache and will be replaced.")
		cache(key) = model
	}
	def reset() {
		cache.clear()
	}
	def get(model_class: String, model_name: String, model_version: String) : Option[Model] = {
		cache.get(makeKey(model_class, model_name, model_version))
	} 
	def print() {
		cache.keys.foreach(k => ScalaUtil.writeInfo(s"Model Key=${k}"))
	}
}