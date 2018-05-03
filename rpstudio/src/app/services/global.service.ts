import { Injectable } from '@angular/core';
import { RPDataType, RPParameter, RPLogEntry} from '../shared/db-classes';

@Injectable()
export class GlobalService {

/***************************************************************************************************************************************************************/
/*                                                                           Data types                                                                        */
/***************************************************************************************************************************************************************/
datatypes      : RPDataType[] = [
   { datatype_name : "integer", short_name : "int",     description : "Long integer",
     parms: [{ parm_name: "bucket", parm_type: "value", data_type: "integer", description: "Bucket numbers", label: "Number of buckets", parm_default: "0"}]},
   { datatype_name : "double",  short_name : "double",  description : "Double precision floating point number",
     parms: [{ parm_name: "bucket", parm_type: "value", data_type: "integer", description: "Bucket numbers", label: "Number of buckets", parm_default: "0"}]},
   { datatype_name : "boolean", short_name : "boolean", description : "true or false boolean", parms: []},
   { datatype_name : "string",  short_name : "string",  description : "Single string value",
     parms: [{ parm_name: "case", parm_type: "choose", data_type: "string",  description: "Change case", label: "Translate Case", choose: ["none", "upper", "lower"], parm_default: "none"},
             { parm_name: "encode", parm_type: "choose", data_type: "string",description: "Encoding option", label: "Encode as", choose: ["category", "one-hot"], parm_default: "category"}]},
   { datatype_name : "text",    short_name : "text",    description : "Multiple delimited string values",
     parms: [{ parm_name: "dlm", parm_type: "choose", data_type: "integer",   description: "Bucket numbers", label: "Delimiter", choose: ["tab", "comma", "space", "pipe"], parm_default: "tab"},
             { parm_name: "case", parm_type: "choose", data_type: "string",  description: "Change case", label: "Change Case to", choose: ["none", "upper", "lower"], parm_default: "none"}]}
];

  url = 'http://ai25:3000/api/';
  basedir = '/home/relpredict';

  constructor() { }

  getServerUrl() {
    return this.url;
  }
  getDataTypes()  : RPDataType[] { 
    return this.datatypes;
  }
  isDate(d) {
    console.log(d);
    let t = d.split("-");
    if (t.length >= 3 && 
        t[0] >= 1900  && 
        t[1] >= 1 && t[1] <= 12 &&
        t[2] >= 1 && t[2] <=31) return true;
    if (d.length == 8 && (d.startsWith('19') || d.startsWith('20'))) return true;
    return false;
  }
  guessDataType(s: string) {
    if (this.isDate(s)) return "date";
    if (s.match(/^[0-9]*$/)) return "integer";
    if (s.match(/^([0-9]*)\.([0-9]*)$/)) return "double";
    var s2 = s.toLowerCase();
    if (s2 == "true" || s2 == "false") return "boolean";
    if (s.indexOf("|") != -1) return "text";
    return "string";
  }

}
