/*
 *   Database core definition classes
 */
export class RPParameterDef {
  parm_name    : string;
  parm_type    : string;       // value (text box), choose (dropdonw), multichoose (dropdown checkbox), range (spinner), date, daterange, time, timerange
  description?  : string;       // fly-by
  parm_default? : string;       // default value
  data_type    : string;       // integer, string, double, date, time
  min?          : number;       // if zero, no min
  max?          : number;       // if zero, no max
  step?         : number;       // range only, must be greater than zero
  label?        : string;
  choose?       : string[];     // list of chooseable values
}
export class RPDataType {
  datatype_name : string;
  short_name    : string;
  description   : string;
  parms         : RPParameterDef[];
}
export class RPParameter {
  parm_name   : string;
  parm_value  : string;
  parm_type   : string;
}
/*
 *   Database model definition classes
 */
export class RPNote {
  note_date  : string;
  note_text  : string;
  entered_by : string; 
}
export class RPFeature {
  name : string;
  type : string;
  label        : string;
  parms        : RPParameter[];
}
export class RPTargetAlgorithm {
  short_name  : string;
  description : string;
  parms       : RPParameter[];
}
export class RPTarget {
  name : string;
  description : string;
  type        : string;
  parms       : RPParameter[];
  algorithms  : RPTargetAlgorithm[];
}
export class RPModelClass {
  class_name  : string;
  label       : string;
  description : string;
  id          : string;
}
export class RPModel {
  name  : string;
  description : string;
  version     : number;
  model_class : string;
  identifier  : string;
  features    : RPFeature[];
  targets     : RPTarget[];
  notes       : RPNote[];
  current     : boolean;
  id          : string;
}
export class RPAlgorithmDef {
  name        : string;
  short_name  : string;
  description : string;
  alg_class   : string;
  parms       : RPParameterDef[];
  id          : string;  
}
export class RPCurrentModel {
  model_class : string;
  model_name  : string;
  model_version : number;
  promoted    : string;
  id          : string;
}
/*
 *   Database admin definition classes
 */
export class RPConfig {
  account       : string;
  account_id    : string;
  active        : boolean;
  start_date    : Date;
  end_date      : Date;
  created_by    : string;
  created_date  : Date;
  modified_date : Date;
}
export class RPLogEntry {
  entry_date  : string;
  issuer      : string;
  severity    : string;
  msg_class   : string;
  msg_action  : string;
  msg_entity  : string;
  msg         : string;
  userid      : string;
  id          : string;
}
export class RPUser {
  username    : string;
  password    : string;
  active      : boolean;
  roles       : string;
  fullname    : string;
  department  : string;
}
/*
 *   Database data definition classes
 */
export class RPBatch {
  batch_id    : string;
  file_name   : string;
  create_date : string;
  batch_type  : string;
  status      : string;
  size        : number;
  id          : string;
}
export class RPDatafile {
  file_name    : string;
  file_type    : string;
  size         : number;
  records      : number;
  datamap_name : string;
  batch_id     : string;
  id           : string;
}
export class RPFieldmap {
  fieldmap_name : string;
  fieldmap_type : string;
}
export class RPDatamap {
  datamap_name  : string;
  datamap_type  : string;
  fields        : RPFieldmap[];
  xlate         : RPFieldmap[];
  id            : string;
}
/*
 *   Database job definition classes
 */
export class RPJob {
  job_name    : string;
  job_type    : string;
  parms       : RPParameterDef[];
  id          : string;
}
export class RPJobExec {
  job_id      : string;
  started     : string;
  ended       : string;
  status      : string; 
  id          : string;
}
export class RPJobSchedule {
  job_id      : string;
  schedule    : string;
  parms       : RPParameter[];	
  id          : string;
}
export class RPTrainedModel {
  model_class   : string;
  model_name    : string;
  model_version : number;
  target_name   : string;
  alg_name      : string;
  alg_type      : string;
  job_name      : string;
  run_date      : string;
  records_train : number;
  records_test  : number;
  results       : Object[];
  id            : string;
}
export class RPResult {
  result_type   : string;
  result_value  : string;
}