import { Pipe, PipeTransform } from '@angular/core';
import { RPDataType, RPParameter, RPFeature, RPTargetAlgorithm, RPTarget, RPModel, RPAlgorithmDef} from '../shared/db-classes';

@Pipe({
  name: 'modelClass'
})
export class ModelClassPipe implements PipeTransform {

  transform(models: RPModel[], args: string): RPModel[] {
  	console.log('Model class filter is ' + args);
  	if (args === 'All Models')
  		return models;
  	else if (args === 'Current Models')
  		return  models.filter(m => m.current); 
  	else 
        return models.filter(m => m.model_class.toLowerCase() === args.toLowerCase());
  }

}
