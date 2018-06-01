package com.ai.relpredict.util

import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import org.apache.log4j.{Level, LogManager, PropertyConfigurator}
import scala.reflect.runtime.universe._

class ConsoleLogger {
  def error(msg : String)   { println(msg) }
  def info(msg : String)    { println(msg) }
  def warn(msg : String)    { println(msg) }
}
     
// create the date/time formatters
object ScalaUtil {
    var verbose = true
    var debug = true
    var localMode = false
    var shutdownHook = () => {}
    val log = /* LogManager.getLogger("Console") */ new ConsoleLogger()
    val sdfTimestamp = new SimpleDateFormat("yyyy-MM-dd:hh:mm:ss.SSS")
    val sdfString = new SimpleDateFormat("yyyyMMddhhmmssSSS")
    val cal = Calendar.getInstance
    def makeParms(parmString : String) = {
       if (parmString.isEmpty()) Map[String, String]()
       else parmString.split(",").map(x => makeKv(x)).toMap
    }
    def makeParmString(parms : Map[String, String]) : String = {
      val sb = new StringBuilder()
      parms.foreach{ case (k,v) => sb.append(s"$k=$v;")}
      sb.toString()
    }
    def setShutdownHook(s : () => Unit) { shutdownHook = s }
    def defaultShutdownHook() = {}
    def setVerbose(b : String) {
        b match {
            case "t" => verbose = true
            case "true" => verbose = true
            case "1" => verbose = true
            case "f" => verbose = false
            case "false" => verbose = false
            case "0" => verbose = false
            case _ => ScalaUtil.writeError(s"Unknown --verbose parameter $b is ignored")
        }
      
    }
    def setDebug(b : String) {
        b match {
            case "t" => debug = true
            case "true" => debug = true
            case "1" => debug = true
            case "f" => debug = false
            case "false" => debug = false
            case "0" => debug = false
            case _ => ScalaUtil.writeError(s"Unknown --debug parameter $b is ignored")
        }
      
    }
    def setEnvironment(env : String) {
      if (env.toLowerCase().startsWith("local")) localMode = true
      else if (env.toLowerCase().startsWith("yarn")) localMode = false
      else {
        writeError(s"Unknown environment $env. Using yarn cluster mode.") 
      }
    }
    def isLocalMode() = localMode
    def controlMsg(msg : String) {
      if (verbose) writeInfo(msg)
    }
    // Utility method to obtain predictor parameters with a default value if not specified.
    def getParm(name : String, default : String, parms : Map[String, String]) : String = {
       parms.get(name) match {
          case None => default
          case Some(s) => s
       }
    }
    def makeKv(kv : String) = {
       val p = kv.split("=")
       (p(0) -> p(1))
    }

    def getDlm(parms : Map[String, String]) = parms.getOrElse("dlm", "\\|")
    def getDate() = new Date()
    def getDateTimeString(date : Date) = sdfTimestamp.format(date)
    def getDirectoryDate() : String = getDirectoryDate(getDate)
    def getDirectoryDate(date : Date) : String = sdfString.format(date)
    def start(msg : String, args : Array[String]) {
      writeInfo(msg + " is starting using the following parameters:")
      val sb = new StringBuilder()
      args.foreach(a => {
          if (a.startsWith("--")) sb.append(">>> ")
          if (a.indexOf(" ") > 0) sb.append("\"" + a + "\"")
          else sb.append(a)
          if (a.startsWith("--") )sb.append(" ")
          else { sb.append(" <<<"); writeInfo(sb.toString()); sb.setLength(0) }
      })
      if (sb.length > 0) writeInfo(sb.toString())
    }
    def end(msg : String) {
      shutdownHook()
      writeInfo(msg + " is ending.")
    }
    def terminal_error(msg : String) {
      writeError(msg)
      writeError("This is a fatal error. The job will termminate.")
      end("Job")
      System.exit(-1)
    }
    def writeError(msg : String) {
      val dt = getDateTimeString(getDate())
      log.error(s"$dt ERROR $msg")
    }
    def writeWarning(msg : String) {
      val dt = getDateTimeString(getDate())
      log.warn(s"$dt WARN $msg")
    }
    def writeInfo(msg : String) {
      val dt = getDateTimeString(getDate())
      log.info(s"$dt INFO $msg")
    }
    def quotedString(text : String) = "\"" + text + "\""
    def indentCount(text : String) : Int = {
      var i = 0;
      if (text.isEmpty()) return 0
      while (i < text.length() && text.charAt(i) == ' ') {
        i += 1
      }
      i
    }
    def getMemberNames[T: TypeTag]: List[String] = typeOf[T].members.collect {
       case m: MethodSymbol if m.isCaseAccessor => {
           val fn = m.fullName.split("\\.")
           fn(fn.length - 1)
       }
    }.toList
}