package com.ai.query
import com.ai.spark._
import akka.actor.{ Actor, ActorLogging, Props }

final case class QColumn(field: String, value: String, field_type: String)
final case class QRow(columns:Array[QColumn])
final case class QRows(rows:Array[QRow])

object QueryActor {
  final case class ActionPerformed(description: String)

  final case class GetRecords(source:String, schema:String, table:String, limit:String)

  def props: Props = Props[QueryActor]
}

class QueryActor extends Actor with ActorLogging {
  import QueryActor._

 
  def receive: Receive = {
    case GetRecords(source,schema,table,limit) =>
     val fullRecord = QueryUtil.SparkQuery(source ,schema,table,limit)

   // val tupledRecords : Array[QColumn] = fullRecord.map(r => (QColumn.apply _).tupled(r) )
   val tupledRecords : Array[QRow] = fullRecord.map(r=>(QRow.apply (r.map(col => (QColumn.apply _).tupled(col) ))))

   sender() ! QRows(tupledRecords)


    }
}