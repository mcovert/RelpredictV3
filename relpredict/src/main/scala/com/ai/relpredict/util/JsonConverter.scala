package com.ai.relpredict.util

import scala.collection.mutable.{ArrayBuffer, ListBuffer, Map}

/**
 * Convert maps or lists to Json with correct typing of elements
 */
object JsonConverter {
  def toJson(o: Any) : String = {
    var o2 = o
    o match {
      case r: Results => o2 = r.getMap()
      case _ =>
    }
    var json = new ListBuffer[String]()
    o2 match {
      case m: scala.collection.mutable.Map[_,_] => {
        for ( (k,v) <- m ) {
          var key = escape(k.asInstanceOf[String])
          v match {
            case a: Results => { json += "\"" + key + "\":" + toJson(a.getMap()); }
            case a: scala.collection.mutable.Map[_,_] => { json += "\"" + key + "\":" + toJson(a); }
            case a: scala.collection.immutable.Map[_,_] => { json += "\"" + key + "\":" + toJson(a); }
            case a: ArrayBuffer[_] => { json += "\"" + key + "\":" + toJson(a); }
            case a: Int => { json += "\"" + key + "\":" + a; }
            case a: Boolean => { json += "\"" + key + "\":" + a; }
            case a: String => { json += "\"" + key + "\":\"" + escape(a) + "\""; }
            case _ => 
          }
        }
      }
      case m: scala.collection.immutable.Map[_,_] => {
        for ( (k,v) <- m ) {
          var key = escape(k.asInstanceOf[String])
          v match {
            case a: Results => { json += "\"" + key + "\":" + toJson(a.getMap()); }
            case a: scala.collection.mutable.Map[_,_] => { json += "\"" + key + "\":" + toJson(a); }
            case a: scala.collection.immutable.Map[_,_] => { json += "\"" + key + "\":" + toJson(a); }
            case a: ArrayBuffer[_] => { json += "\"" + key + "\":" + toJson(a); }
            case a: Int => { json += "\"" + key + "\":" + a; }
            case a: Boolean => { json += "\"" + key + "\":" + a; }
            case a: String => { json += "\"" + key + "\":\"" + escape(a) + "\""; }
            case _ => 
          }
        }
      }
      case m: ArrayBuffer[_] => {
        var list = new ListBuffer[String]()
        for ( el <- m ) {
          el match {
            case a: Results => { list += toJson(a.getMap()); }
            case a: scala.collection.mutable.Map[_,_] => { list += toJson(a); }
            case a: scala.collection.immutable.Map[_,_] => { list += toJson(a); }
            case a: ArrayBuffer[_] => { list += toJson(a); }
            case a: Int => { list += a.toString(); }
            case a: Boolean => { list += a.toString(); }
            case a: String => { list += "\"" + escape(a) + "\""; }
            case _ => println("l-u");
          }
        }
        return "[" + list.mkString(",") + "]"
      }
      case _ => ;
    }
    return "{" + json.mkString(",") + "}"
  }

  private def escape(s: String) : String = {
    return s.replaceAll("\"" , "\\\\\"");
  }
}
