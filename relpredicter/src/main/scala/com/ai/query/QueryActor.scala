package com.ai.query
import com.ai.spark._
import akka.actor.{ Actor, ActorLogging, Props }

final case class QRecords(d_field: String, d_value: String, d_type: String)


object QueryActor {
  final case class ActionPerformed(description: String)

  final case class GetRecords(d_source:String, d_schema:String, d_table:String, q_limit:String)

  def props: Props = Props[QueryActor]
}

class QueryActor extends Actor with ActorLogging {
  import QueryActor._
 
  def receive: Receive = {
    case GetRecords(d_source,d_schama,d_table,q_limit) =>
      sender() !QueryUtil.SparkQuery(d_source,d_schama,d_table,q_limit)
    }
}