package com.ai.relpredicter

import akka.actor.{ Actor, ActorLogging, ActorRef, ActorSystem, Props }

object Predicter {
  def props(message: String, predicterActor: ActorRef): Props = Props(new Predicter(message, predicterActor))
  final case class PredictRecord(inrec: String)
  final case class Prediction(outrec: String)
  case object Predicter
}
class Predicter(message: String, predicterActor: ActorRef) extends Actor {
  import Predicter._

  var prediction = ""

  def receive = {
    case PredictRecord(inrec) =>
      prediction = s"$message, $inrec"
  }
}
object AkkaQuickstart extends App {
  import Predicter._

  val system: ActorSystem = ActorSystem("relpredicter")

  val predicter: ActorRef = system.actorOf(Predicter.props, "predictorActor")

}
