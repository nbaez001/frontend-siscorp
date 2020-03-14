import { Pipe, PipeTransform } from '@angular/core';
import { PrefijoEstado } from '../entities/prefijo-estado';

@Pipe({
  name: 'estadoIntervencion'
})
export class EstadoIntervencionPipe implements PipeTransform {

  transform(estado: PrefijoEstado, tag: 'element' | 'icon'): any {

    let htmlClass = '';

    switch (estado) {
      case PrefijoEstado.PNA : htmlClass = 'warn'; break;
      case PrefijoEstado.ANO : htmlClass = 'amber'; break;
      case PrefijoEstado.ADO : htmlClass = 'green'; break;
      case PrefijoEstado.ASE : htmlClass = 'cyan-100'; break;
    }

    if (tag === 'element') {
      htmlClass = 'mat-' + htmlClass + '-bg';
    } else if (tag === 'icon') {
      htmlClass += '-fg';
    }

    return htmlClass;
  }

}
