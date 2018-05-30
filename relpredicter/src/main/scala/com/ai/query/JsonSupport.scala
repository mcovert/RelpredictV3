package com.ai.query

import com.ai.query.QueryActor.ActionPerformed

//#json-support
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import spray.json.DefaultJsonProtocol

trait JsonSupport extends SprayJsonSupport {
  // import the default encoders for primitive types (Int, String, Lists etc)
  import DefaultJsonProtocol._

  //implicit val queryJsonFormat = jsonFormat3(QRecord)
  implicit val queryJsonFormat = jsonFormat3(QRecords)

  implicit val actionPerformedJsonFormat = jsonFormat1(ActionPerformed)
}
//#json-support