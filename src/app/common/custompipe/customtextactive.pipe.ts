import {Pipe, PipeTransform} from '@angular/core';

//customtextactive.pipe
@Pipe({name: 'customtextactive'})
export class CustomTextActivePipe implements PipeTransform {
    transform(value) {
        return value ? 'general.actived' : 'general.desactived';
    }
}