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

  //var qrecords = Set.empty[QRecord]
 
  def receive: Receive = {
    case GetRecords(dsource,dschema,dtable,qlimit) =>
     val fullRecord = QueryUtil.SparkQuery(dsource ,dschema,dtable,qlimit)
   //  val tupledRecord  = fullRecord.foreach (r => {(QRecord.apply _).tupled(r) 
   // 												println(r)})
    val tupledRecord1 = (QRecord.apply _).tupled(fullRecord(0)) 
    val tupledRecord2 = (QRecord.apply _).tupled(fullRecord(1))
     sender() ! QRecords(Array(tupledRecord1,tupledRecord2))
     	//(QRecord.apply _).tupled(QueryUtil.SparkQuery(dsource ,dschema,dtable,qlimit)(0))
    }
}