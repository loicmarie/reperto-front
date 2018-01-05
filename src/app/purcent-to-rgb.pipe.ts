import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'purcentToRgb'})
export class PurcentToRgbPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    return {
      'color': `rgb(${100-value}%, 0%, ${value}%)`
    };
  }
}
