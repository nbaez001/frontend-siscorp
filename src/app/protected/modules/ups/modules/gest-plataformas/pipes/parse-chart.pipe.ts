import { Pipe, PipeTransform } from '@angular/core';
import { Prefactibilidad } from '../entities/prefactibilidad';

@Pipe({
  name: 'parseChart'
})
export class ParseChartPipe implements PipeTransform {

  transform(datos: Prefactibilidad[], args?: any): any {
    return datos.map((p) => {
      return {
        value: p.cantidadTambos,
        name: p.estado
      };
    });
  }

}
