import { Pipe, PipeTransform } from '@angular/core';
import * as numeral from 'numeral';

@Pipe({
	name: 'numeral',
	pure: true
})
export class NumeralPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		return numeral(value).format(args);
	}
}
