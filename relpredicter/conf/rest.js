/**************************************************************************************/
/*  Run predictions on one or more records using a trained model                      */
/*  URL        /predict                                                               */
/*  Verb       POST                                                                   */
/**************************************************************************************/ 
var predict_request = 
{
	model_class:	'claims',
	model_name:		'claim_denials',
	model_version:	1,         // Specify 0 to use the current model
	option:         'best',    // 'best' = best algorithm, 'all' = all algorithms
	records:		[
	                     { record: [
	                     	 { field: "claim_number",   value: "111111" },
	                     	 { field: "claim_amt",      value: "1234.00"},
	                     	 { field: "diag_codes",     value: "diag1|diag2|diag3"},
	                     	 { field: "cpt_codes",      value: "cpt1|cpt2|cpt3"},
	                     	 { field: "modifier_codes", value: "mod1|mod2|mod3"},
	                     	 { field: "payers",         value: "payer1|payer2|payer3"},  // Encoded as neic_prov_id-claim_type, warp_payer_code,  
//	                     	 { field: "payers",         value: "primary_payer"},         // payer_name, etc. Must be consistent across uses.
	                     	 { field: "ins_type_code",  value: "CO"},
	                     	 { field: "facility_type",  value: "facility_type"},
	                     	 { field: "stay_length",    value: "3"},
	                     	 { field: "referred",       value: "Y"},
	                     	 { field: "state",          value: 'OH'}
	                     ]},
	                     { record: [
	                     { record: [
	                     	 { field: "claim_number",   value: "222222" },
	                     	 { field: "claim_amt",      value: "2345.00"},
	                     	 { field: "diag_codes",     value: "diag1|diag2|diag3"},
	                     	 { field: "cpt_codes",      value: "cpt1|cpt2|cpt3"},
	                     	 { field: "modifier_codes", value: "mod1|mod2|mod3"},
	                     	 { field: "payers",         value: "payer1|payer2|payer3"},  // Encoded as neic_prov_id-claim_type, warp_payer_code,  
	                     	 { field: "ins_type_code",  value: "PR"},
	                     	 { field: "facility_type",  value: "facility_type"},
	                     	 { field: "stay_length",    value: "4"},
	                     	 { field: "referred",       value: "N"},
	                     	 { field: "state",          value: 'KY'}	                     ]}
	                ]
};
var predict_response =
{
	status: 		'OK',
	model_class:	'claims',
	model_name:		'claim_denials',
	model_version:	1,
	model_train_date: '201807151201270101'
	predictions:    [
	                   { 
	                   	 id:        '111111',
	                     target:    'status',
	                     alg:       'dt',
	                     predicted: 'DENY',
	                     prob:      '0.82'
	                   },
	                   {
	                   	 id:        '111111',
	                     target:    'paid_amt',
	                     alg:       'dt',
	                     predicted: '0.00',
	                     prob:      '0.87'
	                   
	                   },
	                   {
	                   	 id:        '111111',
	                     target:    'days_to_pay',
	                     alg:       'dt',
	                     predicted: '4',
	                     prob:      '0.92'
	                   
	                   },
	                   { 
	                   	 id:        '222222',
	                     target:    'status',
	                     alg:       'dt',
	                     predicted: 'PARTIAL',
	                     prob:      '0.82'
	                   },
	                   {
	                   	 id:        '222222',
	                     target:    'paid_amt',
	                     alg:       'dt',
	                     predicted: '1999.00',
	                     prob:      '0.87'
	                   
	                   },
	                   {
	                   	 id:        '222222',
	                     target:    'days_to_pay',
	                     alg:       'dt',
	                     predicted: '27',
	                     prob:      '0.88'
	                   
	                   },
	                ]
};
/**************************************************************************************/
/*  Query a data source, schema, and table limiting records retrieved                 */
/*  URL        /query                                                                 */
/*  Verb       POST                                                                   */
/*                                                                                    */
/*  To only get metadata and one record, set limit to  1                              */
/*                                                                                    */
/**************************************************************************************/ 
var query_request = 
{
	data_source:    'hive',
	schema:	        'relpredict',
	table:   		'claim_status',
	limit:			2
};
var query_response =
{
	status: 		'OK',
	data_source:    'hive',
	schema:	        'relpredict',
	table:   		'claim_status',
	records:		[
	                     { record: [
	                     	 { field: "claim_number", value: "111111", type: 'string' },
	                     	 { field: "claim_amt",    value: "1234.00", type: 'string'},
	                     	 { field: "payer",        value: "AETNA", type: 'string'},
	                     	 { field: "state",        value: 'OH', type: 'string'}
	                     ]},
	                     { record: [
	                     	 { field: "claim_number", value: "222222", type: 'string' },
	                     	 { field: "claim_amt",    value: "2345.00", type: 'string'},
	                     	 { field: "payer",        value: "AETNA", type: 'string'},
	                     	 { field: "state",        value: 'KY', type: 'string'}
	                     ]}
	                ] 
};
