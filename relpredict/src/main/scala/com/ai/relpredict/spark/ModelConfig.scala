import com.ai.relpredict.Spark._
import com.ai.relpredict.jobs.RPConfig

case class ModelConfig(model_class: String, model_name: String, model_version: String) {
	var trained_model = ""
	var algMap = scala.collection.mutable.Map[String, scala.collection.mutable.HashSet[String]]()
	
	def addTargetAlgorithm(t: String, a: String) {
		if (algMap.contains(t)) algMap(t) += a
        else {
        	var list = scala.collection.mutable.HashSet[String]()
        	list += a
        	algMap(t) = list
        }
	}
	def runAlgorithm(t: String, a: String) : Boolean = {
		if (algMap.contains(t) && algMap(t).contains(s)) true
		else false
	}
	def loadFromCurrent() {
       RPConfig.setModelDir(model_class, model_name, model_version)
       val currentFile = s"${RPConfig.getModelDir()}current"
       SparkUtil.getHDFSReader(currentFile) match {
       	  case Some(br: BufferedReader) => {
       	  	while (br.hasNext) {
       	  		val line = br.readLine
       	  		val tokens = line.split("=")
       	  		tokens(0) match {
       	  			case "trained_model" => trained_model = tokens(1)
       	  			case _ => addTargetAlgorithm(tokens(0), tokens(1))
       	  		}
       	  	}
            br.close
       	  }
       	  case None => ScalaUtil.terminalError(s"Model configuration file ${currentFile}cannot be loaded. This is a fatal error.")
       }
	}
}