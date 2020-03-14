import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Aplicacion } from '../entities/aplicacion';
import { environment as env } from 'environments/environment';
import { Observable } from 'rxjs';
import { ErrorTransaccion } from '../entities/error-transaccion';

@Injectable({
  providedIn: 'root'
})
export class AplicacionService {

  constructor(
    private httpClient: HttpClient
  ) { }

  lista(): Observable<Aplicacion[]> {
    return this.httpClient.get<Aplicacion[]>(`${env.backendUrl}/aplicacion/lista`);
  }

  crear(datos: any): Observable<ErrorTransaccion> {
    return this.httpClient.post<ErrorTransaccion>(`${env.backendUrl}/aplicacion/crear`, datos);
  }

  editar(datos: any): Observable<ErrorTransaccion> {
    return this.httpClient.put<ErrorTransaccion>(`${env.backendUrl}/aplicacion/editar`, datos);
  }

  eliminar(codigoAplicacion: number): Observable<any> {
    return this.httpClient.delete(`${env.backendUrl}/aplicacion/eliminar/${codigoAplicacion}`);
  }
}
