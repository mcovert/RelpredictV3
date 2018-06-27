package com.ai.relpredict.spark

import com.ai.relpredict.dsl._
import org.apache.spark.sql.SparkSession
import org.apache.spark.rdd.RDD
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.mllib.tree.model.{DecisionTreeModel, Node}
import com.ai.relpredict.util.ScalaUtil
import org.apache.spark.mllib.linalg.{Vector, Vectors}
import java.io._
import java.net._
import org.apache.hadoop.fs._
import org.apache.hadoop.conf._
import org.apache.hadoop.io._
/**
 * SparkUtil attempts to encapsulate all Spark specific activities into one model.
 */
object SparkUtil {
  var ss: SparkSession = null
  def setSparkSession(sc: SparkSession) = {
    ss = sc
  }
  def getSparkSession() = ss
  /**
   * Build a spark session 
   */
   def buildSparkSession(jobName : String, sparkMaster : String) : SparkSession = {
        val sc = SparkSession.builder().appName(jobName).config("spark.master", sparkMaster).enableHiveSupport().getOrCreate() 
        sc match {
          case s : SparkSession => 
          case _ => ScalaUtil.terminal_error("Unable to create SparkSession") 
        }
        sc.sparkContext.setLogLevel("WARN")
        setSparkSession(sc)
        sc
   }
   /** 
    *  Build all of the string to index maps
    */
   def buildStringMap(name : String)(df : DataFrame) : Map[String, Int] = {
     val sc = ss
     import sc.sqlContext.implicits._
     val map = df.select(name).distinct.filter(x => x.length > 0).map(r => r.getString(0)).collect.toArray.zipWithIndex.toMap
     val defValue = map.size
     val map2 = map + ("?" -> defValue)
     map2.withDefaultValue(defValue)
   }
   /**
    * Build a text map collecting all specified strings in the delimited fields
    */
   def buildTextMap(name : String, dlm : String)(df : DataFrame) : Map[String, Int] = {
     val sc = ss
     import sc.sqlContext.implicits._
     val map = df.select(name).flatMap(r => r.getString(0).split(dlm)).distinct.filter(x => x.length > 0).collect.toArray.zipWithIndex.toMap
     val defValue = map.size
     val map2 = map + ("?" -> defValue)
     map2.withDefaultValue(defValue)
   }
   /**
    * Build a text from an array of delimited strings
    */
   def buildTextMapFromArray(name : Array[String], dlm : String) : Map[String, Int] = {
     val map = name.flatMap(r => r.split(dlm)).distinct.filter(x => x.length > 0).toArray.zipWithIndex.toMap
     val defValue = map.size
     val map2 = map + ("?" -> defValue)
     map2.withDefaultValue(defValue)
   }
   /**
    * Invert a map. Note: it should be unique (1 to 1)
    */
   def invertMap(origMap : Map[String, Int]) : Map[Int, String] =  (Map() ++ origMap.map(_.swap))
   /**
    * Save a map to an HDFS file
    */
   def saveMapToHDFSFile(map: Map[String, Int], fileName: String) {
      var sb = new StringBuilder()
      sb.append("key,index\n")
      map.foreach{
        case (k, v) => sb.append(k + "," + v + "\n")
      }
      saveTextToHDFSFile(sb.toString, fileName)
   }
   /**
    * Load a map from an HDFS file using SparkSQL CSV loader
    */
   def loadMapFromHDFSFile(fileName: String) : Map[String, Int] = {
       val map_df = ss.read.option("header","true").csv(fileName)
       map_df.rdd.map(row => (row.getAs[String](0), row.getAs[Int](1))).collect.toMap
   }
   /**
    * Count the number of distinct values in a DataFrame column
    */
   def getColumnValueCount(name : String, df : DataFrame) = df.select(name).distinct.count
   /**
    * Count the number of distinct values in a delimited text column of a DataFrame
    */
   def getDelimitedColumnValueCount(name : String, dlm : String, df : DataFrame) : Int = {
       df.select(name).collect.map(r => r(0).toString.split(dlm).map(v => v)).flatten.distinct.count(_ => true)
   }
   /**
    * Build a category map (a map of vector position to count of categories)
    */
   def buildCategoryMap(featureSet : FeatureSet) : Map[Int, Int] = {
    var categoryMap = scala.collection.mutable.Map[Int, Int]()
    var featurePos = 0
    for (f <- featureSet.features) {
      f match {
         case f : TextFeature => { fillMap(categoryMap, f.name, featurePos, f.getVectorLength(), 2); featurePos += f.getVectorLength() }
         case f : StringFeature => { 
           f.encStyle match {
             case "ohc" => { fillMap(categoryMap, f.name, featurePos, f.getVectorLength(), 2); featurePos += f.getVectorLength() } 
             case "category" => { fillMap(categoryMap, f.name, featurePos, 1, f.getCount()); featurePos += 1 } 
             case _ => ScalaUtil.terminal_error(s"Invalid encoding style ${f.encStyle} was specified for ${f.getName()}")
           }
         }
         case f : BooleanFeature => { fillMap(categoryMap, f.name, featurePos, 1, 2); featurePos += 1 }
         case _ => featurePos += 1
      }
    }
    if (ScalaUtil.verbose) ScalaUtil.controlMsg(s"Category map is ${categoryMap.size} entries.")
    categoryMap.toMap
   }
   /** 
    *  Build the ML Vectors
    */
   def buildVector(colText : String, dMap : Map[String, Int]) : Vector = {
	   val l = colText.split("\\|").map(t => dMap(t)).toArray.distinct
	   Vectors.sparse(dMap.size, l, Array.fill[Double](l.size)(1.0)).toDense
   }  
   /** 
    *  Compute the confusion matrix
    */
   def getConfusionMatrix(results : RDD[(Double, Double)], dim : Int) = {
      var matrix = Array.ofDim[Int](dim, dim)
      results.collect.foreach(r => matrix(r._1.toInt)(r._2.toInt) += 1)
      matrix
   }
   /**
    * Build a predicted DataFrame (that can be persisted to either Hive or HDFS)
    */
   def getPredictedDataFrame(jobname : String, targetName : String, algorithmName : String, rdd : RDD[(String, Double)]) : DataFrame = {
     val sc = ss
     import sc.sqlContext.implicits._
     val dt = ScalaUtil.getDate()
     rdd.map(r => (jobname, targetName, algorithmName, dt, r._1, r._2)).toDF("jobname", "target", "algorithm", "date", "recid", "predicted")
   }
   /**
    * Save a data frame as a Hive table
    */
   def saveAsHiveTable(df : DataFrame, tableName : String) : Boolean = {
     try {
        df.write.saveAsTable(tableName)
        true
     } catch {
       case  unknown : Throwable => { ScalaUtil.writeError(s"Writing to Hive table $tableName failed: $unknown.getMessage()"); false }
     }
   }
   /**
    * Get an HDFS file reader
    */
   def getHDFSFileReader(url : String) : Option[Reader] = {
     try {
         val pt = new Path(url);
         val fs = FileSystem.get(new Configuration());
         Some(new BufferedReader(new InputStreamReader(fs.open(pt))))  
     } catch {
         case ex: FileNotFoundException =>{
            ScalaUtil.terminal_error(s"Missing file exception for model file $url")
            None
         }
         case ex: IOException => {
            ScalaUtil.terminal_error(s"IO Exception reading model file $url")
            None
         }
      }
   }
   /**
    * Get and HDFS file writer
    */
   def getHDFSFileWriter(url : String, delete : Boolean = false) : Option[OutputStreamWriter] = {
     try {
        val path = new Path(url)
        val conf = new Configuration(ss.sparkContext.hadoopConfiguration)
        val fs = path.getFileSystem(conf)
        if (fs.exists(path)) {
           if (delete) fs.delete(path, true)
           else ScalaUtil.terminal_error(s"HDFS file $url exists and delete option was not specified")
        }
        Some(new OutputStreamWriter(new BufferedOutputStream(fs.create(path))))
     } catch {
        case e : Throwable => ScalaUtil.terminal_error(s"Opening output HDFS file $url failed: ${e.printStackTrace()}")
        None
     }
   }
   /**
    * Save text to an HDFS file
    */
   def saveTextToHDFSFile(text : String, fileName : String) {
     ScalaUtil.controlMsg(s"Saving $fileName to HDFS")
     val writer = getHDFSFileWriter(fileName, false).get
     writer.write(text)
     writer.close()
   }
   /**
    * List an HDFS directory, returning an Array of FileStatus objects
    */
   def getHDFSDirectoryList(path : String) = {
     val fs = FileSystem.get(new Configuration())
     fs.listStatus(new Path(path))
   }
   def hdfsFileExists(url : String) : Boolean = {
     try {
        val path = new Path(url)
        val conf = new Configuration(ss.sparkContext.hadoopConfiguration)
        val fs = path.getFileSystem(conf)
        fs.exists(path)
     } catch {
        case e : Throwable => ScalaUtil.terminal_error(s"Opening output HDFS file $url failed: ${e.printStackTrace()}")
        false
     }
   }
   /**
    * Find the most recently updated FileStatus object
    */
   def getNewestDirectory(path : String) : Option[Path] = {
     val l = getHDFSDirectoryList(path).sortWith{ case (fs1 :FileStatus, fs2 : FileStatus) => fs1.getModificationTime > fs2.getModificationTime}
     if (l.length == 0) None
     else Some(l(0).getPath)
   }
   /**
    * Fill a map with values from a starting key for a specified length
    */
   private def fillMap(map : scala.collection.mutable.Map[Int, Int], name : String, pos : Int, count : Int, value : Int) {
      if (ScalaUtil.debug) {
        if (count > 1) ScalaUtil.controlMsg(s"Filling $name category map from $pos to ${pos + count - 1} with $value")
        else  ScalaUtil.controlMsg(s"Filling $name map at $pos with $value")
      }
      for (i <- pos to (pos + count - 1)) map(i) = value
   }
}