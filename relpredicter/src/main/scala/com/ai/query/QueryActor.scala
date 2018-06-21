package com.ai.query
import com.ai.spark._
import akka.actor.{ Actor, ActorLogging, Props }
import org.apache.spark.sql.SparkSession

final case class QColumn(field: String, value: String, field_type: String)
final case class QRow(columns:Array[QColumn])
final case class QRows(rows:Array[QRow])

final case class TableName(table_name: String)
final case class TableList(table_list:Array[TableName])



object QueryActor {
  final case class ActionPerformed(description: String)

  final case class GetRecords(source:String, schema:String, table:String, limit:String)

  final case class GetTables(source:String, schema:String)

  def props: Props = Props[QueryActor]



   
}

class QueryActor extends Actor with ActorLogging {
  import QueryActor._
  
   

  override def preStart { 
    println("starting spark session") 
   
  }

  override def postStop { 
    println("stopping spark session") 
    val sc = SparkSession.builder().appName("SparkQuery").config("spark.master", "local").enableHiveSupport()
    .config("yarn.resourcemanager.address","ai02.analyticsinside.us:8032")
    .config("hive.metastore.uris", "thrift://ai04.analyticsinside.us:9083")
    .getOrCreate() 
    sc.stop()
  }


 
  def receive: Receive = {
    case GetRecords(source,schema,table,limit) =>
      val fullRecord = QueryUtil.SparkQuery(source ,schema,table,limit)
      // val tupledRecords : Array[QColumn] = fullRecord.map(r => (QColumn.apply _).tupled(r) )
      val tupledRecords : Array[QRow] = fullRecord.map(r=>(QRow.apply (r.map(col => (QColumn.apply _).tupled(col) ))))
      sender() ! QRows(tupledRecords)

    case GetTables(source,schema) =>
      val tablesRecord=QueryUtil.SparkTables(source,schema)
      val tablesList : Array[TableName] = tablesRecord.map(r=>(TableName.apply (r.toString)))
      sender() ! TableList(tablesList)


    }
}