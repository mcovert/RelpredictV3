import com.ai.spark._
import akka.actor.{ Actor, ActorLogging, Props }

final case class QRecords(field: String, value: String, type: String)


object QueryActor {
  final case class ActionPerformed(description: String)

 
  final case class GetRecords(data_source:String, schema:String, table:String, q_limit:String)
  

  def props: Props = Props[QueryActor]
}

class QueryActor extends Actor with ActorLogging {
  import QueryActor._
 
  def receive: Receive = {
    case GetRecords(data_source,schama,table,q_limit) =>
      sender() !QueryUtil.SparkQuery(data_source,schama,table,q_limit)
    }
}