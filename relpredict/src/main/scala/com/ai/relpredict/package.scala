package com.ai

import org.apache.spark.mllib.linalg.Vector
import org.apache.spark.mllib.regression.LabeledPoint

/*
 * Types used by RelPredict.
 */
package object relpredict {
  type TrainingVector   = LabeledPoint     // Used for training algorithms
  type TestingVector    = (String, TrainingVector)   // Used to test trained models. String is record ID
  type TestedVector     = (String, Double, Double)   // Result of a model test
  type PredictionVector = (String, Vector)           // Used to predict based on a trained model. String is record ID
  type PredictedVector  = (String, Double)           // The prediction made by a trained model
}