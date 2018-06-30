package com.ai.relpredict.spark

import com.ai.relpredict.dsl._
import org.apache.spark.sql._
import com.ai.relpredict.util.{ScalaUtil, Datamap}
import com.ai.relpredict.jobs._

/**
 * The Model class is an implementation of a ModelDef specification. It is the container for all components.
 */
case class Model(modelDef : ModelDef, df : Option[DataFrame], dm: Datamap) {
  val name        = modelDef.name
  val version     = modelDef.version
  val description = modelDef.desc
  var featureSets = modelDef.featureSets.map(fsd => (fsd.name -> buildFeatureSet(fsd))).toMap
  var targets     = buildTargets(modelDef.targets) 
  val ss          = SparkUtil.getSparkSession()
  /**
   *  Load a full model from a directory. This includes all of the map files for features
   *  and targets. 
   *       1. Locate and load the modeldef and current files
   *          a. The modeldef file contains the definition language for the model (model_class/model_name/model_version/model_name.modeldef)
   *          b. The current file (model_class/model_name/model_version/model_name.current) designates the current training date and for each target, 
   *             the algorithm (and ML model) that will be used (model_class/model_name/model_version/model_train_date/target/algorithm/model). 
   *             Note that this designation is user specified using rpstudio. 
   *       2. Create the model file from it and a SparkSession object
   *          a. For each feature (text or string) and each target (string), find and load its map file into a data frame
   *             i.  Search the trained model directory first
   *             ii. Search data/vocabulary next
   *          b. Call the builders in the model for each target and feature
   *       3. Return the model.
   *          a. Calling model.predict()
   */
  def buildFeatureSet(featureSet : FeatureSetDef) = {
     new FeatureSet(featureSet.name, featureSet.features.map(f => buildFeature(f)), featureSet.idName)
  }
  def buildFeature(feature : FeatureDef) : Feature[_] = {
     // Apply data map name transformation to the feature to optimize vector operations
     feature.varType match {
        case "text" => new TextFeature(feature.name, feature.desc, feature.parms, ss, getTargetOrFeatureMap(feature.name, ss, df), dm)
        case "string" => {
          if (ScalaUtil.getParm("encode", "ohc", feature.parms) == "ohc")
             new StringFeature(feature.name, feature.desc, feature.parms, ss, getTargetOrFeatureMap(feature.name, ss, df), dm)
          else
             new StringCategoryFeature(feature.name, feature.desc, feature.parms, ss, getTargetOrFeatureMap(feature.name, ss, df), dm)
        }
        case "double" => new DoubleFeature(feature.name, feature.desc, feature.parms, ss, dm)
        case "integer" => new IntegerFeature(feature.name, feature.desc, feature.parms, ss, dm)
        case "boolean" => new BooleanFeature(feature.name, feature.desc, feature.parms, ss, dm)
        case unknown => { ScalaUtil.terminal_error(s"Unknown feature type $unknown"); new NullFeature }
     }         
  }
  def buildTargets(targetDefs : List[TargetDef]) = {
    targetDefs.map(t => buildTarget(t : TargetDef))
  }
  def buildTarget(target : TargetDef) = {
     // Apply data map name transformation to the target to optimize vector operations
     target.targetType match {
       case "string" => {
         /* TO-DO: Need to pre-map targets if a data map has been specified */
         val map = getTargetOrFeatureMap(target.name, ss, df)
         val invMap = SparkUtil.invertMap(map)
         new StringTarget(target.name, target.desc, target.algorithms, map, SparkUtil.invertMap(map), featureSets(target.featureSet), dm, target.parms)
       }
       case "boolean" => new BooleanTarget(target.name, target.desc, target.algorithms, featureSets(target.featureSet), dm, target.parms)
       case "integer" => new IntegerTarget(target.name, target.desc, target.algorithms, featureSets(target.featureSet), dm, target.parms)
       case "double" => new DoubleTarget(target.name, target.desc, target.algorithms, featureSets(target.featureSet), dm, target.parms)
       case  unknown => { 
          ScalaUtil.terminal_error(s"Unknown target type for target $target.name : $target.targetType" )
          new BooleanTarget(target.name, target.desc, target.algorithms, featureSets(target.featureSet), dm, target.parms) 
       }  
     }
  }
  def saveModel() {
     targets.foreach(t => {
        saveMap(t.getName(), t.getMap())
        t.algorithms.foreach(a => {
           val fileName = RPConfig.getAlgorithmDir(t, a.get) 
           ScalaUtil.controlMsg(s"Saving model ${fileName}.model")
           a.get.saveModel(ss, fileName)
        })
     })
     featureSets.keys.foreach{ k => featureSets(k).features.foreach{ f => saveMap(f.getName(), f.getMap())}}
  }
  var saveStatus = scala.collection.mutable.HashSet[String]()
  def saveMap(name: String, map: Option[Map[String, Int]]) {
    if (!saveStatus.contains(name)) return
    map match {
      case Some(m : Map[String, Int]) => SparkUtil.saveMapToHDFSFile(m, RPConfig.getTrainedModelDir() + name + ".tsv")
      case None =>
    }
  }
  def getTargetOrFeatureMap(name: String, ss: SparkSession, df: Option[DataFrame]) : Map[String, Int] = {
    ScalaUtil.writeInfo(s"Locating vocabulary map for ${name}")
    // Search trained model directory
    var fileName = RPConfig.getTrainedModelDir() + name + ".tsv"
    //ScalaUtil.writeInfo(s">>>Looking for ${fileName}")
    if (SparkUtil.hdfsFileExists(fileName)) {
           ScalaUtil.writeInfo(s"Loading vocabulary map ${name} from trained model directory: ${fileName}")
           val m = SparkUtil.loadMapFromHDFSFile(fileName)
           ScalaUtil.checkMap(m)
           return m
    }
    // Search model directory
    fileName = RPConfig.getModelDir() + name + ".tsv"
    //ScalaUtil.writeInfo(s">>>Looking for ${fileName}")
    if (SparkUtil.hdfsFileExists(fileName)) {
           ScalaUtil.writeInfo(s"Loading vocabulary map ${name} from model directory: ${fileName}")
           val m = SparkUtil.loadMapFromHDFSFile(fileName)
           ScalaUtil.checkMap(m)
           return m
    }
    // Search global vocabulary directory
    fileName = RPConfig.getVocabularyDir() + name + ".tsv"
    //ScalaUtil.writeInfo(s">>>Looking for ${fileName}")
    if (SparkUtil.hdfsFileExists(fileName)) {
           ScalaUtil.writeInfo(s"Loading vocabulary map ${name} from global directory: ${fileName}")
           val m = SparkUtil.loadMapFromHDFSFile(fileName)
           ScalaUtil.checkMap(m)
           return m
    }
    // Create vocabulary from SQL statement
    //ScalaUtil.writeInfo(s">>>Creating from SQL")
    df match {
        case Some(d: DataFrame) => {
           ScalaUtil.writeInfo(s"Generating vocabulary map ${name} from SQL statement")
           val m = d.select(name).collect.map(r => r.getString(0)).distinct.zipWithIndex.toMap
           ScalaUtil.checkMap(m)
           saveStatus += name
           return m
        }
        case _ => ScalaUtil.terminal_error(s"Unable to load target or feature map for $name. This is a fatal error.")
    }
    Map[String, Int]()
  }
}