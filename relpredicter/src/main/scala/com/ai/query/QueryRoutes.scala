package com.ai.query
import akka.actor.{ ActorRef, ActorSystem }
import akka.event.Logging

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
import com.ai.query.QueryActor._
import akka.pattern.ask
import akka.util.Timeout

//#user-routes-class
trait QueryRoutes extends JsonSupport {
  //#user-routes-class

  // we leave these abstract, since they will be provided by the App
  implicit def system: ActorSystem
 // implicit val materializer: ActorMaterializer = ActorMaterializer()

  lazy val log = Logging(system, classOf[QueryRoutes])

  // other dependencies that QueryRoutes use
  def queryActor: ActorRef 

  // Required by the `ask` (?) method below
  implicit lazy val timeout = Timeout(5.seconds) // usually we'd obtain the timeout from the system's configuration

  //#all-routes
  //#users-get-post

  lazy val queryRoutes: Route =
    pathPrefix("query") {
      //#users-get-delete
        
        
            get 
              {
               parameters('d_source.as[String], 'd_schema.as[String], 'd_table.as[String],'q_limit.as[String])
               {(d_source,d_schema,d_table,q_limit)=>
              val query: Future[QRecords] =
                (queryActor ? GetRecords(d_source, d_schema, d_table, q_limit)).mapTo[QRecords]
               complete(query)
              }
            }
            /*
             val queryRoutes =
    path("query") {
      //#users-get-delete
        
        
            get 
              {
               parameters('d_source.as[String], 'd_schema.as[String], 'd_table.as[String],'q_limit.as[String])
               {(d_source,d_schema, d_table, q_limit)=>
                complete
                  {
                    queryActor ? GetRecords(d_source, d_schema, d_table, q_limit)
                  }
               
              }
            }
        
  //#all-routes
    }*/
        
  //#all-routes
    }
  }
