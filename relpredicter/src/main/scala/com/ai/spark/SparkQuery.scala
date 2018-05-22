import org.apache.spark.sql.SparkSession
import org.apache.spark.rdd.RDD
import org.apache.spark.sql._
import org.apache.spark.sql.types._

class SparkQuery(val DataSource : String, val SchemaName : String, val TableName : String, val QLimit : String)
{

val sc = SparkSession.builder().appName("Test").config("spark.master", "yarn").enableHiveSupport().getOrCreate() 
sc.sql("use relpredict")

val claimsDF =sc.sql("select *  from claim_status where limit 1")
claimsDF.collect()
}
