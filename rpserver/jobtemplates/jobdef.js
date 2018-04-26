var jobtemplates = [
   { name: 'train',
     script: 'train.sh',
     type:   'spark',
     parms: [
        { parm_name:  'split',      parm_value: '80',                   label: 'Split percent',   hint: '10 - 90 (80)'},
        { parm_name:  'model_def',  parm_value: '',                     label: 'Model Definition' hint: 'class, name, and version'},
        { parm_name:  'data_from',  parm_value: 'sql',                  label: 'Get data from',   hint: 'SQL, File, Directory'},
        { parm_name:  'data_def',   parm_value: '',                     label: 'SQL, file, or directory', hint: 'SQL, file name, or directory name'},},
        { parm_name:  'jobname',    parm_value: 'rp_train_${run_date}', label: 'Jobname',         hint: 'Jobname_identifier'},
        { parm_name:  'verbose',    parm_value: 'false',                label: 'Verbose output',  hint: 'true or false'},
     ]
   },
   { name: 'predict',
     script: 'predict.sh',
     type:   'spark',
     parms: [
        { parm_name:  'model_def',  parm_value: '',      label: 'Model Definition'},
        { parm_name:  'data_from',  parm_value: 'sql',   label: 'Get data from'},
        { parm_name:  'data_def',   parm_value: '',      label: 'SQL, file, or directory'},
        { parm_name:  'jobname',    parm_value: '',      label: 'Jobname'},
        { parm_name:  'verbose',    parm_value: 'false', label: 'Verbose output'},
     ]
   },
   { name: 'textclassify',
     script: 'textclassify.sh',
     type:   'java',
     parms: [
        { parm_name:  'model_def',  parm_value: '',      label: 'Model Definition'},
        { parm_name:  'data_from',  parm_value: 'sql',   label: 'Get data from'},
        { parm_name:  'data_def',   parm_value: '',      label: 'SQL, file, or directory'},
        { parm_name:  'jobname',    parm_value: '',      label: 'Jobname'},
        { parm_name:  'verbose',    parm_value: 'false', label: 'Verbose output'},
     ]
   },
];
exports.jobs = jobtemplates;