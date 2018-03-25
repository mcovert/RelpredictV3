package com.ai.relpredict.spark

import com.ai.relpredict.dsl._
import org.apache.spark.sql._
import com.ai.relpredict.util.{ScalaUtil, Datamap}
import com.ai.relpredict.jobs._

/**
 * The Model class is an implementation of a ModelDef specification. It is the container for all components.
 */
case class Model(modelDef : ModelDef, ss : SparkSession, df : DataFrame, dm: Datamap) {
  val name = modelDef.name
  val version = modelDef.version
  val description = modelDef.desc
  val featureSets = modelDef.featureSets.map(fsd => (fsd.name -> buildFeatureSet(fsd))).toMap
  val targets = buildTargets(modelDef.targets)
  
  def buildFeatureSet(featureSet : FeatureSetDef) = {
     new FeatureSet(featureSet.name, featureSet.features.map(f => buildFeature(f)), featureSet.idName)
  }
  def buildFeature(feature : FeatureDef) : Feature[_] = {
     // Apply data map name transformation to the feature to optimize vector operations
     feature.varType match {
        case "text" => new TextFeature(feature.name, feature.desc, feature.parms, ss, df, dm)
        case "string" => {
          if (ScalaUtil.getParm("encode", "ohc", feature.parms) == "ohc")
             new StringFeature(feature.name, feature.desc, feature.parms, ss, df, dm)
          else
             new StringCategoryFeature(feature.name, feature.desc, feature.parms, ss, df, dm)
        }
        case "double" => new DoubleFeature(feature.name, feature.desc, feature.parms, ss, df, dm)
        case "integer" => new IntegerFeature(feature.name, feature.desc, feature.parms, ss, df, dm)
        case "boolean" => new BooleanFeature(feature.name, feature.desc, feature.parms, ss, df, dm)
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
         val map = df.select(target.name).collect.map(r => r.getString(0)).distinct.zipWithIndex.toMap
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
  def saveModel(runDate : String) {
     targets.foreach(t => {
        t.algorithms.foreach(a => {
           val fileName = RPConfig.getAlgorithmDir(this, runDate, t, a.get) 
           ScalaUtil.controlMsg(s"Saving model ${fileName}.model")
           a.get.saveModel(ss, fileName)
        })
     })
  }
}