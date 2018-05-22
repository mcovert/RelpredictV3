import akka.actor.{ Actor, ActorLogging, Props }

final case class QRecords(data_source:String, schema:String, table:String, q_limit:String)


object UserRegistryActor {
  final case class ActionPerformed(description: String)

 
  final case class GetRecords(q_limit:String)
  

  def props: Props = Props[QueryActor]
}

class QueryActor extends Actor with ActorLogging {
  import QueryActor._

  var records = Set.empty[QRrecords]

  def receive: Receive = {
    case GetRecords(q_limit) =>
      sender() ! ActionPerformed(s"Records \${q_limit} selected")
    }
}