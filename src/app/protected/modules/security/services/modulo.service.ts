import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modulo } from '../entities/modulo';
import { environment as env } from 'environments/environment';
import { ErrorTransaccion } from '../entities/error-transaccion';
import { Unidad } from '../entities/unidad';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {

  constructor(
    private httpClient: HttpClient
  ) { }

  lista(codigoAplicacion: number): Observable<Modulo[]> {
    return this.httpClient.get<Modulo[]>(`${env.backendUrl}/modulo/lista/${codigoAplicacion}`);
  }

  crear(datos: any): Observable<ErrorTransaccion> {
    return this.httpClient.post<ErrorTransaccion>(`${env.backendUrl}/modulo/crear`, datos);
  }

  editar(datos: any): Observable<ErrorTransaccion> {
    return this.httpClient.put<ErrorTransaccion>(`${env.backendUrl}/modulo/editar`, datos);
  }

  eliminar(codigoModulo: number): Observable<any> {
    return this.httpClient.delete(`${env.backendUrl}/modulo/eliminar/${codigoModulo}`);
  }

  listaUnidades(): Observable<Unidad[]> {
    return this.httpClient.get<Unidad[]>(`${env.backendUrl}/modulo/lista-unidades`);
  }
}
