package com.ai.query

import com.ai.query.QueryActor.ActionPerformed

//#json-support
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import spray.json.DefaultJsonProtocol

trait JsonSupport extends SprayJsonSupport {
  // import the default encoders for primitive types (Int, String, Lists etc)
  import DefaultJsonProtocol._

  //implicit val queryJsonFormat = jsonFormat3(QRecord)
  implicit val qcolumnFormat = jsonFormat3(QColumn)
  implicit val qrowFormat = jsonFormat1(QRow)
  implicit val qrowsFormat = jsonFormat1(QRows)
  implicit val tablenameFormat = jsonFormat1(TableName)
  implicit val tablelistFormat = jsonFormat1((TableList))
  implicit val tablerequestFormat = jsonFormat2(TableRequest)
  implicit val queryrequestFormat = jsonFormat4(QueryRequest)

  implicit val actionPerformedFormat = jsonFormat1(ActionPerformed)
}
//#json-support