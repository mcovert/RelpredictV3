lazy val akkaHttpVersion = "10.0.11"
lazy val akkaVersion    = "2.5.11"
lazy val sparkVersion ="2.1.0"

resolvers ++= Seq(
  "apache-snapshots" at "http://repository.apache.org/snapshots/",
  "Typesafe Repo" at "http://repo.typesafe.com/typesafe/releases/"
)


lazy val root = (project in file(".")).
  settings(
    inThisBuild(List(
      organization    := "com.ai.query",
      scalaVersion    := "2.11.8"
    )),
    name := "akka-http-rp-scala",
    libraryDependencies ++= Seq(
      "com.typesafe.akka" %% "akka-http"            % akkaHttpVersion,
      "com.typesafe.akka" %% "akka-http-spray-json" % akkaHttpVersion,
      "com.typesafe.akka" %% "akka-http-xml"        % akkaHttpVersion,
      "com.typesafe.akka" %% "akka-stream"          % akkaVersion,

      "com.typesafe.akka" %% "akka-http-testkit"    % akkaHttpVersion % Test,
      "com.typesafe.akka" %% "akka-testkit"         % akkaVersion     % Test,
      "com.typesafe.akka" %% "akka-stream-testkit"  % akkaVersion     % Test,
      "org.scalatest"     %% "scalatest"            % "3.0.1"         % Test,

       "org.apache.spark" %% "spark-core" % sparkVersion,
  "org.apache.spark" %% "spark-sql" % sparkVersion,
  "org.apache.spark" %% "spark-mllib" % sparkVersion,
  "org.apache.spark" %% "spark-hive" % sparkVersion,
  "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.4"
  //"org.scalatest" % "scalatest_2.11" % "2.2.4" % "test"

    )
  )