package com.ai.rplite

import java.io._

object RPLUtil {

	def fileExists(fileName: String) : Boolean = {
		match RPLConfig.isLocalMode {
			case true  => {
				try {
				   val f = new File(fileName)
				   if (f.exists() && ! f.isDirectory()) true
				   else false
				} catch {
			        case e : Throwable => println(s"Accessing local file $fileName failed: ${e.printStackTrace()}")
			        false
			    }
			}
			case false => {
			     try {
			        val path = new Path(fileName)
			        val conf = new Configuration(ss.sparkContext.hadoopConfiguration)
			        val fs = path.getFileSystem(conf)
			        fs.exists(path)
			     } catch {
			        case e : Throwable => println(s"Accessing HDFS file $fileName failed: ${e.printStackTrace()}")
			        false
			     }
			}
		}
	}
}