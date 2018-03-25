package com.ai.relpredict.dsl

import scala.util.parsing._
import scala.util.parsing.combinator._
import com.ai.relpredict.dsl._

class GrammarDef extends RegexParsers {
  def word            : Parser[String] = "[a-zA-Z0-9]+".r ^^ { x => x.toString }
  def quotedString    : Parser[String] = """(["]).*?\1""".r ^^ { x => x.toString.substring(1, x.length() - 1) }
  def sIdentifier     : Parser[String] = word | quotedString
  
  def sTargetStmt     : Parser[TargetDef] = "target" ~ sIdentifier ~ "type" ~ sIdentifier ~ "description" ~ sIdentifier ~ "predictedby" ~ sIdentifier ~ "using" ~ sIdentifier ~ "parameters" ~ sIdentifier ^^ { 
                                               case td ~ tg ~ tpd ~ t ~ dd ~ d ~ ad ~ a ~ ud ~ u ~ pd ~ p => new TargetDef(tg, t, d, a, u, p) }  
                                               
  def sFeatureStmt    : Parser[FeatureDef] = "feature" ~ sIdentifier ~ "type" ~ sIdentifier ~ "description" ~ sIdentifier ~ "parameters" ~ sIdentifier ^^ { 
                                               case fd ~ f ~ tpd ~ t ~ dd ~ d ~ pd ~ p => new FeatureDef(f, t, d, p) }  
                                               
  def sFeatureSetStmt : Parser[FeatureSetDef] = "featureset" ~ sIdentifier ~ "id" ~ sIdentifier ~ rep(sFeatureStmt) ^^ { 
                                               case fsd ~ fs ~ idd ~ idName ~ fsl => new FeatureSetDef(fs, fsl, idName) } 
                                               
  def modelDef        : Parser[ModelDef] = "model" ~ sIdentifier ~ "version" ~ sIdentifier ~ "description" ~ sIdentifier ~ rep(sFeatureSetStmt) ~ rep(sTargetStmt) ^^ {
                                               case md ~ m ~ vd ~ v ~ dd ~ d ~ fsl ~ tsl => new ModelDef(m, v, d, fsl, tsl) }
  
  
  def comment         : Parser[Any] = """([/][*]).*?[*][/]""".r ^^ { x => }
}