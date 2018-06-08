package com.ai.query
import com.ai.spark._
import akka.actor.{ Actor, ActorLogging, Props }

final case class QRecord(dfield: String, dvalue: String, dtype: String)
final case class QRecords(qrecords:Array[QRecord])

object QueryActor {
  final case class ActionPerformed(description: String)

  final case class GetRecords(dsource:String, dschema:String, dtable:String, qlimit:String)

  def props: Props = Props[QueryActor]
}

class QueryActor extends Actor with ActorLogging {
  import QueryActor._

 
  def receive: Receive = {
    case GetRecords(dsource,dschema,dtable,qlimit) =>
     val fullRecord = QueryUtil.SparkQuery(dsource ,dschema,dtable,qlimit)

    val tupledRecords : Array[QRecord] = fullRecord.map(r => (QRecord.apply _).tupled(r) )

   sender() ! QRecords(tupledRecords)


    }
}