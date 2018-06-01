package com.ai.query

import scala.concurrent.Await
import scala.concurrent.duration.Duration

import akka.actor.{ ActorRef, ActorSystem }
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Route
import akka.stream.ActorMaterializer
import com.ai.query.QueryActor._

import scala.concurrent.duration._
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.directives.MethodDirectives.delete
import akka.http.scaladsl.server.directives.MethodDirectives.get
import akka.http.scaladsl.server.directives.MethodDirectives.post
import akka.http.scaladsl.server.directives.RouteDirectives.complete
import akka.http.scaladsl.server.directives.PathDirectives.path

import scala.concurrent.Future
import akka.pattern.ask
import akka.util.Timeout


//#main-class
object QueryServer extends App with QueryRoutes {

  // set up ActorSystem and other dependencies here
  //#main-class
  //#server-bootstrapping

  
    implicit val system: ActorSystem = ActorSystem("rpAkkaHttpServer")
    implicit val materializer: ActorMaterializer = ActorMaterializer()
  //#server-bootstrapping

    val queryActor: ActorRef = system.actorOf(QueryActor.props, "queryActor")


  //#main-class
  // from the QueryRoutes trait
  //lazy val routes: Route = QueryRoutes
  //#main-class

  
  lazy val routes: Route = queryRoutes
  //#all-routes
  //#users-get-post

  

  //#http-server
  Http().bindAndHandle(queryRoutes, "localhost", 8080)

  println(s"Server online at http://localhost:8080/")

  Await.result(system.whenTerminated, Duration.Inf)
  //#http-server
  //#main-class
}

//#quick-start-server                    