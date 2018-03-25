name := "RelPredict"
scalaVersion := "2.11.8"
val sparkVersion = "2.1.0"

resolvers ++= Seq(
  "apache-snapshots" at "http://repository.apache.org/snapshots/"
)

libraryDependencies ++= Seq(
  "org.apache.spark" %% "spark-core" % sparkVersion,
  "org.apache.spark" %% "spark-sql" % sparkVersion,
  "org.apache.spark" %% "spark-mllib" % sparkVersion,
  "org.apache.spark" %% "spark-hive" % sparkVersion,
  "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.4",
  "org.scalatest" % "scalatest_2.11" % "2.2.4" % "test"
)
mainClass in (Compile,run) := Some("com.ai.relpredict.jobs.RelPredict")
