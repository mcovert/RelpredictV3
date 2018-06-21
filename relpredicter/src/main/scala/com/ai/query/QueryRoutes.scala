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
import com.ai.util._

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
  implicit lazy val timeout = Timeout(120 seconds) // usually we'd obtain the timeout from the system's configuration

    
  //#all-routes
  //#users-get-post

 // lazy val queryRoutes: Route =
    val queryRoutes : Route =
    
      //#query-get      
        path("query")
        {
          get 
          {
            parameters("source", "schema", "table","limit")
            {(source,schema,table,limit)=>
                                                                    
              val query: Future[QRows] = (queryActor ? GetRecords(source, schema, table, limit)).mapTo[QRows]
              complete(query)
            }
          } 
        } ~
        path("tables")
        {
          /*get 
          {
            parameters("source", "schema")
            {(source,schema)=>
                                                                    
                val tables: Future[TableList] = (queryActor ? GetTables(source, schema)).mapTo[TableList]
                complete(tables)
              }
            }*/
            post
            {
               entity(as[TableRequest]) { tableRequest => // will unmarshal JSON to Table request
                  val source = tableRequest.source
                  val schema = tableRequest.schema
                  val tables: Future[TableList] = (queryActor ? GetTables(source, schema)).mapTo[TableList]
                  complete(tables)
                }
              }
            }
             
         }
            
  
