import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from './../utils/index';

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform
{
    transform(mainArr: any[], searchText: string, property: string): any
    {
        return Utils.filterArrayByString(mainArr, searchText);
    }
}
