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
	                     	 { field: "claim_number", value: "111111" },
	                     	 { field: "claim_amt",    value: "1234.00"},
	                     	 { field: "payer",        value: "AETNA"},
	                     	 { field: "state",        value: 'OH'}
	                     ]},
	                     { record: [
	                     	 { field: "claim_number", value: "222222" },
	                     	 { field: "claim_amt",    value: "2345.00"},
	                     	 { field: "payer",        value: "AETNA"},
	                     	 { field: "state",        value: 'KY'}
	                     ]}
	                ]
};
var predict_response =
{
	status: 		'OK',
	model_class:	'claims',
	model_name:		'claim_denials',
	model_version:	1     // Specify 0 to use the current model
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
