import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataSharedService {

  private idAutoGastoGenerado = new BehaviorSubject<any>("");
  obtenerIdAutoGastoGenerado = this.idAutoGastoGenerado.asObservable();

  constructor() { }

  // envio de variable desde componente generar-requerimiento hacia modal-requerimiento
  enviarIdAutoGenerado(data: any) {
    this.idAutoGastoGenerado.next(data)
  }

}
