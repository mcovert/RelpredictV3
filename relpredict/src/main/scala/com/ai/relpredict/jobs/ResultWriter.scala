package com.ai.relpredict.jobs

import com.ai.relpredict.util.JsonConverter

object ResultWriter {
	def createMap() = Map[String, Any]()

	def getString(r: Results) : String = {
        var entries = r.getMapEntries()

        var root = createMap()

        entries.foreach{
          case (k: String, v: Option[Any]) => root = addMapElements(root, k, v.get)
        }
        return JsonConverter.toJson(createMap() + ("results" -> root))
	}
	def addMapElements(map: Map[String, Any], key: String, v: Any) : Map[String, Any] = {
		val pos = key.indexOf(".")
		if (pos == -1) return map + (key -> v)
		else {
			val k = key.substring(0, pos)
			val k_remaining = key.substring(pos + 1)
			if (map.contains(k)) {
				map(k) match {
					case m: Map[String, Any] => return map + (k -> addMapElements(m, k_remaining, v))
				}			
			}
			else return map + (k -> addMapElements(createMap(), k_remaining, v))
		}
	}
}