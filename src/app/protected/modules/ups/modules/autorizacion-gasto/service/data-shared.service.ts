import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataSharedService {

  private idAutoGastoGenerado = new BehaviorSubject<any>("");
  obtenerIdAutoGastoGenerado = this.idAutoGastoGenerado.asObservable();

  private idAutoGastoGeneradoNuevoRecurso = new BehaviorSubject<any>("");
  obteneridAutoGastoGeneradoNuevoRecurso = this.idAutoGastoGeneradoNuevoRecurso.asObservable();

  constructor() { }

  // envio de variable desde componente generar-requerimiento hacia modal-requerimiento
  enviarIdAutoGenerado(data: any) {
    this.idAutoGastoGenerado.next(data)
  }

  // envio de variable desde componente create-insumo hacia generar-requerimiento
  enviarIdAutoGeneradoDesdeCrearRecurso(data: any) {
    this.idAutoGastoGeneradoNuevoRecurso.next(data)
  }

}
